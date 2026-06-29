from flask import Flask, render_template, session, redirect, request, jsonify
from datetime import datetime

app = Flask(__name__)
app.secret_key="secret"


# ── USSD Session State ──
ussd_sessions = {}
ussd_transactions = []
ussd_menu = {
    "main": {
        "text": "Welcome to Erinde - National Health Service\n1. Book Appointment\n2. Make Payment\n3. Queue Number\n4. Find Hospital\n0. Exit",
        "options": {"1": "book_name", "2": "payment_amount", "3": "queue_hospital", "4": "find_hospital", "0": "exit"}
    },
    "book_name": {
        "text": "Enter patient full name:",
        "next": "book_hospital"
    },
    "book_hospital": {
        "text": "Select hospital:\n1. CHUK\n2. Kanombe Hospital\n3. Kigali Teaching Hospital\n4. Rwamagana Hospital\n5. Butare Hospital",
        "options": {"1": "book_doctor", "2": "book_doctor", "3": "book_doctor", "4": "book_doctor", "5": "book_doctor"}
    },
    "book_doctor": {
        "text": "Select doctor:\n1. Dr Giraso - General\n2. Dr Alice - Pediatrics\n3. Dr John - Surgery\n4. Dr Marie - Maternity",
        "options": {"1": "book_confirm", "2": "book_confirm", "3": "book_confirm", "4": "book_confirm"}
    },
    "book_confirm": {
        "text": "Confirm booking?\n1. Confirm\n2. Cancel",
        "options": {"1": "book_done", "2": "main"}
    },
    "book_done": {
        "text": "✅ Appointment booked!\nRef: ERN-{ref}\nQueue: Q-{queue}\nHospital: {hospital}\nEstimated wait: {wait} min\n\nThank you for using Erinde.",
        "end": True
    },
    "payment_amount": {
        "text": "Enter amount to pay (RWF):",
        "next": "payment_method"
    },
    "payment_method": {
        "text": "Payment method:\n1. Mobile Money (MTN)\n2. Mobile Money (Airtel)\n3. CBHI Insurance",
        "options": {"1": "payment_pin", "2": "payment_pin", "3": "payment_done"}
    },
    "payment_pin": {
        "text": "Enter Mobile Money PIN:",
        "next": "payment_done"
    },
    "payment_done": {
        "text": "✅ Payment of RWF {amount} successful!\nRef: PAY-{ref}\nThank you for using Erinde.",
        "end": True
    },
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
    "exit": {
        "text": "Thank you for using Erinde. Stay healthy!",
        "end": True
    }
}


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
        hospitals = {"1": "CHUK", "2": "Kanombe Hospital", "3": "Kigali Teaching Hospital", "4": "Rwamagana Hospital", "5": "Butare Hospital"}
        sess["data"]["hospital"] = hospitals.get(user_input, "CHUK")
    elif sess["state"] == "book_doctor":
        doctors = {"1": "Dr Giraso", "2": "Dr Alice", "3": "Dr John", "4": "Dr Marie"}
        sess["data"]["doctor"] = doctors.get(user_input, "Dr Giraso")
    elif sess["state"] == "book_confirm" and user_input == "1":
        import random
        ref = f"ERN-{random.randint(10000,99999)}"
        queue = random.randint(100, 999)
        wait = random.randint(10, 90)
        sess["data"].update({"ref": ref, "queue": queue, "wait": wait})
        ussd_transactions.append({"phone": phone, "action": "book_appointment", "hospital": sess["data"].get("hospital"), "ref": ref, "time": datetime.now().isoformat()})
    elif sess["state"] == "payment_amount":
        sess["data"]["amount"] = user_input
    elif sess["state"] == "payment_pin":
        sess["data"]["pin"] = "****"
        import random
        ref = f"PAY-{random.randint(10000,99999)}"
        sess["data"]["ref"] = ref
        ussd_transactions.append({"phone": phone, "action": "payment", "amount": sess["data"].get("amount"), "ref": ref, "time": datetime.now().isoformat()})
    elif sess["state"] == "queue_hospital":
        hospitals = {"1": "CHUK", "2": "Kanombe", "3": "Kigali", "4": "Rwamagana", "5": "Butare"}
        sess["data"]["hospital"] = hospitals.get(user_input, "CHUK")
        import random
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


@app.route("/ussd/simulator")
def ussd_simulator():
    return render_template("ussd_simulator.html")


@app.route("/ussd/transactions")
def ussd_transactions_view():
    return jsonify(ussd_transactions[-50:])


@app.route("/ussd/stats")
def ussd_stats():
    import random
    return jsonify({
        "active_sessions": len(ussd_sessions),
        "today_transactions": len(ussd_transactions),
        "total_bookings": sum(1 for t in ussd_transactions if t.get("action") == "book_appointment"),
        "total_payments": sum(1 for t in ussd_transactions if t.get("action") == "payment"),
        "ussd_code": "*880#",
        "status": "active"
    })


@app.route("/dashboard")
def dashboard():
    context = {
        "user": session.get("user", "Admin"),
        "year": datetime.now().year,
        "total_hospitals": 1248,
        "active_patients": 34892,
        "today_appointments": 12470,
        "avg_wait_time": 23,
        "daily_collections": "42.8M",
        "monthly_total": "1.2B"
    }
    return render_template("dashboard.html", **context)


@app.route("/location")
def location():
    return render_template("location.html")


@app.route("/hospitals")
def hospitals():
    return render_template("hospitals.html")


@app.route("/doctors")
def doctors():
    return render_template("doctors.html")


@app.route("/book")
def book():
    return render_template("book.html")


@app.route("/appointments")
def appointments():
    return render_template("appointment.html")


@app.route("/history")
def history():
    return render_template("history.html")


app.run(debug=True)