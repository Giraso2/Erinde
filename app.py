import json, base64, hmac, hashlib, time, uuid, random
from flask import Flask, render_template, session, redirect, request, jsonify, Response
from datetime import datetime
from functools import wraps

app = Flask(__name__)
app.secret_key = "erinde-secret-key-2026"
JWT_SECRET = "erinde-jwt-secret-2026"

# ── Pure Python JWT (HS256) ──
def b64url(data):
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

def b64url_decode(s):
    s += "=" * (4 - len(s) % 4)
    return base64.urlsafe_b64decode(s)

def make_jwt(payload, expiry=86400):
    header = b64url(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    payload["iat"] = int(time.time())
    payload["exp"] = int(time.time()) + expiry
    payload_b64 = b64url(json.dumps(payload).encode())
    sig = hmac.new(JWT_SECRET.encode(), f"{header}.{payload_b64}".encode(), hashlib.sha256).digest()
    return f"{header}.{payload_b64}.{b64url(sig)}"

def verify_jwt(token):
    try:
        parts = token.split(".")
        if len(parts) != 3: return None
        expected_sig = hmac.new(JWT_SECRET.encode(), f"{parts[0]}.{parts[1]}".encode(), hashlib.sha256).digest()
        actual_sig = b64url_decode(parts[2])
        if not hmac.compare_digest(expected_sig, actual_sig): return None
        payload = json.loads(b64url_decode(parts[1]))
        if payload.get("exp", 0) < time.time(): return None
        return payload
    except Exception:
        return None

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        token = auth.replace("Bearer ", "")
        payload = verify_jwt(token)
        if not payload:
            return jsonify({"error": "Unauthorized"}), 401
        request.user = payload
        return f(*args, **kwargs)
    return decorated

# ── In-Memory Data Store ──
users = {}
appointments = []
payments = []
queues = {}
queue_counter = 1000

hospitals = {
    "chuk": {"name": "CHUK", "location": "Kigali", "beds": 340, "capacity": 0.92, "wait": 45},
    "kanombe": {"name": "Kanombe Hospital", "location": "Kanombe", "beds": 200, "capacity": 0.78, "wait": 32},
    "kigali": {"name": "Kigali Teaching Hospital", "location": "Kacyiru", "beds": 280, "capacity": 0.65, "wait": 28},
    "rwamagana": {"name": "Rwamagana Hospital", "location": "Rwamagana", "beds": 150, "capacity": 0.34, "wait": 12},
    "butare": {"name": "Butare University Hospital", "location": "Huye", "beds": 180, "capacity": 0.45, "wait": 18},
    "musanze": {"name": "Musanze Hospital", "location": "Musanze", "beds": 120, "capacity": 0.28, "wait": 8}
}

doctors_list = [
    {"id": 1, "name": "Dr Giraso", "specialty": "General", "hospital": "CHUK"},
    {"id": 2, "name": "Dr Alice", "specialty": "Pediatrics", "hospital": "Kigali Teaching Hospital"},
    {"id": 3, "name": "Dr John", "specialty": "Surgery", "hospital": "CHUK"},
    {"id": 4, "name": "Dr Marie", "specialty": "Maternity", "hospital": "Kanombe Hospital"},
    {"id": 5, "name": "Dr David", "specialty": "Cardiology", "hospital": "Kigali Teaching Hospital"},
    {"id": 6, "name": "Dr Sandra", "specialty": "General", "hospital": "Rwamagana Hospital"}
]

# ── Seed a demo user ──
users["demo@erinde.rw"] = {
    "id": "usr_001", "name": "Demo User", "email": "demo@erinde.rw",
    "password": "demo123", "phone": "+250780000000", "role": "citizen"
}

# ── USSD Session State (unchanged) ──
ussd_sessions = {}
ussd_transactions = []
ussd_menu = {
    "main": {
        "text": "Welcome to Erinde - National Health Service\n1. Book Appointment\n2. Make Payment\n3. Queue Number\n4. Find Hospital\n0. Exit",
        "options": {"1": "book_name", "2": "payment_amount", "3": "queue_hospital", "4": "find_hospital", "0": "exit"}
    },
    "book_name": {"text": "Enter patient full name:", "next": "book_hospital"},
    "book_hospital": {
        "text": "Select hospital:\n1. CHUK\n2. Kanombe Hospital\n3. Kigali Teaching Hospital\n4. Rwamagana Hospital\n5. Butare Hospital",
        "options": {"1": "book_doctor", "2": "book_doctor", "3": "book_doctor", "4": "book_doctor", "5": "book_doctor"}
    },
    "book_doctor": {
        "text": "Select doctor:\n1. Dr Giraso - General\n2. Dr Alice - Pediatrics\n3. Dr John - Surgery\n4. Dr Marie - Maternity",
        "options": {"1": "book_confirm", "2": "book_confirm", "3": "book_confirm", "4": "book_confirm"}
    },
    "book_confirm": {"text": "Confirm booking?\n1. Confirm\n2. Cancel", "options": {"1": "book_done", "2": "main"}},
    "book_done": {
        "text": "✅ Appointment booked!\nRef: ERN-{ref}\nQueue: Q-{queue}\nHospital: {hospital}\nEstimated wait: {wait} min\n\nThank you for using Erinde.",
        "end": True
    },
    "payment_amount": {"text": "Enter amount to pay (RWF):", "next": "payment_method"},
    "payment_method": {
        "text": "Payment method:\n1. Mobile Money (MTN)\n2. Mobile Money (Airtel)\n3. CBHI Insurance",
        "options": {"1": "payment_pin", "2": "payment_pin", "3": "payment_done"}
    },
    "payment_pin": {"text": "Enter Mobile Money PIN:", "next": "payment_done"},
    "payment_done": {"text": "✅ Payment of RWF {amount} successful!\nRef: PAY-{ref}\nThank you for using Erinde.", "end": True},
    "queue_hospital": {
        "text": "Enter hospital name or code:\n1. CHUK\n2. Kanombe\n3. Kigali\n4. Rwamagana\n5. Butare",
        "options": {"1": "queue_number", "2": "queue_number", "3": "queue_number", "4": "queue_number", "5": "queue_number"}
    },
    "queue_number": {
        "text": "📋 Your queue number: Q-{queue}\nPatients ahead: {ahead}\nEstimated wait: {wait} min\nHospital: {hospital}\n\nYou will receive an SMS when your turn approaches.",
        "end": True
    },
    "find_hospital": {
        "text": "Find hospitals by:\n1. Nearest to me\n2. Least busy\n3. Specific district\n0. Back",
        "options": {"1": "find_result", "2": "find_result", "3": "find_district", "0": "main"}
    },
    "find_district": {
        "text": "Select district:\n1. Kigali City\n2. Eastern Province\n3. Southern Province\n4. Northern Province\n5. Western Province",
        "options": {"1": "find_result", "2": "find_result", "3": "find_result", "4": "find_result", "5": "find_result"}
    },
    "find_result": {
        "text": "🏥 Nearby Hospitals:\n1. CHUK - 2km - 92% full\n2. Kanombe - 5km - 78% full\n3. Kigali Hosp - 3km - 65% full\n\nReply with number to book, or 0 to go back.",
        "options": {"1": "book_hospital", "2": "book_hospital", "3": "book_hospital", "0": "find_hospital"}
    },
    "exit": {"text": "Thank you for using Erinde. Stay healthy!", "end": True}
}


# ════════════════════════════════════════
#  AUTHENTICATION (JWT)
# ════════════════════════════════════════

@app.route("/api/auth/register", methods=["POST"])
def api_register():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    if email in users:
        return jsonify({"error": "Email already registered"}), 409
    users[email] = {
        "id": f"usr_{len(users)+1:03d}",
        "name": data.get("name", ""),
        "email": email,
        "password": data.get("password", ""),
        "phone": data.get("phone", ""),
        "role": "citizen"
    }
    token = make_jwt({"id": users[email]["id"], "email": email, "role": "citizen"})
    return jsonify({"token": token, "user": {"name": users[email]["name"], "email": email}}), 201

@app.route("/api/auth/login", methods=["POST"])
def api_login():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    user = users.get(email)
    if not user or user["password"] != password:
        return jsonify({"error": "Invalid credentials"}), 401
    token = make_jwt({"id": user["id"], "email": email, "role": user["role"]})
    session["user"] = user["name"]
    return jsonify({"token": token, "user": {"id": user["id"], "name": user["name"], "email": email, "phone": user["phone"], "role": user["role"]}})

@app.route("/api/auth/me")
@jwt_required
def api_me():
    email = request.user["email"]
    user = users.get(email)
    if not user: return jsonify({"error": "Not found"}), 404
    return jsonify({"id": user["id"], "name": user["name"], "email": email, "phone": user["phone"], "role": user["role"]})


# ════════════════════════════════════════
#  APPOINTMENT API
# ════════════════════════════════════════

@app.route("/api/appointments", methods=["GET", "POST"])
@jwt_required
def api_appointments():
    if request.method == "GET":
        user_appts = [a for a in appointments if a["user_email"] == request.user["email"]]
        return jsonify(user_appts)

    data = request.get_json()
    ref = f"ERN-{random.randint(10000, 99999)}"
    q = random.randint(100, 999)
    a = {
        "id": str(uuid.uuid4())[:8],
        "ref": ref,
        "user_email": request.user["email"],
        "patient_name": data.get("patient_name", request.user.get("name", "")),
        "hospital": data.get("hospital", ""),
        "doctor": data.get("doctor", ""),
        "date": data.get("date", datetime.now().strftime("%Y-%m-%d")),
        "time": data.get("time", "09:00"),
        "status": "confirmed",
        "queue_number": f"Q-{q}",
        "estimated_wait": random.randint(10, 60),
        "created_at": datetime.now().isoformat()
    }
    appointments.append(a)
    return jsonify(a), 201

@app.route("/api/appointments/<appt_id>", methods=["GET", "PUT", "DELETE"])
@jwt_required
def api_appointment(appt_id):
    appt = next((a for a in appointments if a["id"] == appt_id), None)
    if not appt: return jsonify({"error": "Not found"}), 404

    if request.method == "GET":
        return jsonify(appt)
    if request.method == "DELETE":
        appt["status"] = "cancelled"
        return jsonify({"message": "Cancelled"})

    data = request.get_json()
    for k in ["patient_name", "hospital", "doctor", "date", "time", "status"]:
        if k in data: appt[k] = data[k]
    return jsonify(appt)


# ════════════════════════════════════════
#  MOBILE MONEY PAYMENT
# ════════════════════════════════════════

@app.route("/api/payments/mobile-money", methods=["POST"])
@jwt_required
def api_mobile_money():
    data = request.get_json()
    amount = int(data.get("amount", 0))
    if amount < 100: return jsonify({"error": "Minimum amount is 100 RWF"}), 400

    provider = data.get("provider", "MTN")
    phone = data.get("phone", request.user.get("phone", ""))

    ref = f"PAY-{random.randint(10000, 99999)}"
    payment = {
        "id": str(uuid.uuid4())[:8],
        "ref": ref,
        "user_email": request.user["email"],
        "amount": amount,
        "provider": provider,
        "phone": phone,
        "status": "completed",
        "purpose": data.get("purpose", "appointment"),
        "created_at": datetime.now().isoformat()
    }
    payments.append(payment)
    return jsonify(payment), 201

@app.route("/api/payments")
@jwt_required
def api_payments():
    user_payments = [p for p in payments if p["user_email"] == request.user["email"]]
    return jsonify(user_payments)


# ════════════════════════════════════════
#  REAL-TIME QUEUE TRACKING (SSE)
# ════════════════════════════════════════

@app.route("/api/queue/<hospital_id>")
def api_queue(hospital_id):
    hospital = hospitals.get(hospital_id)
    if not hospital: return jsonify({"error": "Hospital not found"}), 404

    q_list = queues.get(hospital_id, [])
    now_serving = random.randint(10, 50)
    return jsonify({
        "hospital": hospital["name"],
        "total_in_queue": len(q_list),
        "now_serving": f"Q-{now_serving}",
        "estimated_wait": hospital["wait"],
        "capacity": hospital["capacity"],
        "queue": q_list[-20:]
    })

@app.route("/api/queue/<hospital_id>/stream")
def api_queue_stream(hospital_id):
    hospital = hospitals.get(hospital_id)
    if not hospital: return jsonify({"error": "Not found"}), 404

    def event_stream():
        while True:
            q_list = queues.get(hospital_id, [])
            now_serving = random.randint(10, 60)
            data = json.dumps({
                "hospital": hospital["name"],
                "total_in_queue": len(q_list),
                "now_serving": f"Q-{now_serving}",
                "estimated_wait": hospital["wait"],
                "capacity": hospital["capacity"],
                "timestamp": datetime.now().isoformat()
            })
            yield f"data: {data}\n\n"
            time.sleep(3)

    return Response(event_stream(), mimetype="text/event-stream")

@app.route("/api/queue/<hospital_id>/join", methods=["POST"])
@jwt_required
def api_queue_join(hospital_id):
    global queue_counter
    hospital = hospitals.get(hospital_id)
    if not hospital: return jsonify({"error": "Not found"}), 404

    queue_counter += 1
    entry = {
        "id": str(uuid.uuid4())[:8],
        "user_email": request.user["email"],
        "queue_number": f"Q-{queue_counter}",
        "hospital": hospital["name"],
        "status": "waiting",
        "joined_at": datetime.now().isoformat()
    }
    if hospital_id not in queues: queues[hospital_id] = []
    queues[hospital_id].append(entry)
    return jsonify(entry), 201

@app.route("/api/hospitals")
def api_hospitals():
    return jsonify([{"id": hid, **h} for hid, h in hospitals.items()])

@app.route("/api/doctors")
def api_doctors():
    return jsonify(doctors_list)


# ════════════════════════════════════════
#  FRONTEND ROUTES
# ════════════════════════════════════════

@app.route("/")
def home():
    if session.get("user"): return redirect("/dashboard")
    return redirect("/login")

@app.route("/mobile")
def mobile_app():
    return render_template("mobile.html")

@app.route("/login")
def login_page():
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")

@app.route("/dashboard")
def dashboard():
    context = {
        "user": session.get("user", "Guest"),
        "year": datetime.now().year,
        "total_hospitals": len(hospitals),
        "active_patients": 34892,
        "today_appointments": len(appointments) or 12470,
        "avg_wait_time": 23,
        "daily_collections": "42.8M",
        "monthly_total": "1.2B"
    }
    return render_template("dashboard.html", **context)

@app.route("/payment")
def payment_page():
    return render_template("payment.html")

@app.route("/queue/track")
def queue_track_page():
    return render_template("queue_track.html")

@app.route("/location")
def location():
    return render_template("location.html")

@app.route("/hospitals")
def hospitals_page():
    return render_template("hospitals.html")

@app.route("/doctors")
def doctors_page():
    return render_template("doctors.html")

@app.route("/book")
def book():
    return render_template("book.html")

@app.route("/appointments")
def appointments_page():
    return render_template("appointment.html")

@app.route("/history")
def history():
    return render_template("history.html")

@app.route("/ussd/simulator")
def ussd_simulator():
    return render_template("ussd_simulator.html")

# ── USSD Handler (unchanged) ──

@app.route("/ussd", methods=["POST", "GET"])
def ussd_handler():
    if request.method == "GET":
        return jsonify({"service": "Erinde USSD Gateway", "status": "active", "code": "*880#"})

    session_id = request.form.get("sessionId", request.args.get("sessionId", "default"))
    phone = request.form.get("phoneNumber", request.args.get("phone", "+250780000000"))
    text = request.form.get("text", request.args.get("text", ""))

    if session_id not in ussd_sessions:
        ussd_sessions[session_id] = {"state": "main", "data": {}, "phone": phone}

    sess = ussd_sessions[session_id]
    parts = text.split("*") if text else []
    user_input = parts[-1] if parts else ""
    menu = ussd_menu.get(sess["state"])

    if not text:
        sess["state"] = "main"
        sess["data"] = {}
        response = ussd_menu["main"]["text"]
        ussd_transactions.append({"phone": phone, "action": "menu_main", "time": datetime.now().isoformat()})
        return f"CON {response}"

    if not menu:
        sess["state"] = "main"
        response = ussd_menu["main"]["text"]
        return f"CON {response}"

    if menu.get("end"):
        del ussd_sessions[session_id]
        response = menu["text"].format(**sess["data"]) if sess["data"] else menu["text"]
        return f"END {response}"

    if user_input == "0":
        sess["state"] = "main"
        response = ussd_menu["main"]["text"]
        return f"CON {response}"

    options = menu.get("options", {})
    next_state = options.get(user_input, menu.get("next"))
    if not next_state:
        response = f"Invalid option. {menu['text']}"
        return f"CON {response}"

    if sess["state"] == "book_name":
        sess["data"]["name"] = user_input
    elif sess["state"] == "book_hospital":
        hospitals_map = {"1": "CHUK", "2": "Kanombe Hospital", "3": "Kigali Teaching Hospital", "4": "Rwamagana Hospital", "5": "Butare Hospital"}
        sess["data"]["hospital"] = hospitals_map.get(user_input, "CHUK")
    elif sess["state"] == "book_doctor":
        doctors_map = {"1": "Dr Giraso", "2": "Dr Alice", "3": "Dr John", "4": "Dr Marie"}
        sess["data"]["doctor"] = doctors_map.get(user_input, "Dr Giraso")
    elif sess["state"] == "book_confirm" and user_input == "1":
        ref = f"ERN-{random.randint(10000, 99999)}"
        queue = random.randint(100, 999)
        wait = random.randint(10, 90)
        sess["data"].update({"ref": ref, "queue": queue, "wait": wait})
        ussd_transactions.append({"phone": phone, "action": "book_appointment", "hospital": sess["data"].get("hospital"), "ref": ref, "time": datetime.now().isoformat()})
    elif sess["state"] == "payment_amount":
        sess["data"]["amount"] = user_input
    elif sess["state"] == "payment_pin":
        sess["data"]["pin"] = "****"
        ref = f"PAY-{random.randint(10000, 99999)}"
        sess["data"]["ref"] = ref
        ussd_transactions.append({"phone": phone, "action": "payment", "amount": sess["data"].get("amount"), "ref": ref, "time": datetime.now().isoformat()})
    elif sess["state"] == "queue_hospital":
        hospitals_map = {"1": "CHUK", "2": "Kanombe", "3": "Kigali", "4": "Rwamagana", "5": "Butare"}
        sess["data"]["hospital"] = hospitals_map.get(user_input, "CHUK")
        sess["data"]["queue"] = random.randint(100, 999)
        sess["data"]["ahead"] = random.randint(5, 50)
        sess["data"]["wait"] = random.randint(10, 120)

    sess["state"] = next_state
    next_menu = ussd_menu.get(next_state)
    if next_menu:
        try:
            response = next_menu["text"].format(**sess["data"]) if sess["data"] else next_menu["text"]
        except KeyError:
            response = next_menu["text"]
        if next_menu.get("end"):
            del ussd_sessions[session_id]
            return f"END {response}"
        return f"CON {response}"
    return f"CON {ussd_menu['main']['text']}"

@app.route("/ussd/transactions")
def ussd_transactions_view():
    return jsonify(ussd_transactions[-50:])

@app.route("/ussd/stats")
def ussd_stats():
    return jsonify({
        "active_sessions": len(ussd_sessions),
        "today_transactions": len(ussd_transactions),
        "total_bookings": sum(1 for t in ussd_transactions if t.get("action") == "book_appointment"),
        "total_payments": sum(1 for t in ussd_transactions if t.get("action") == "payment"),
        "ussd_code": "*880#",
        "status": "active"
    })


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
