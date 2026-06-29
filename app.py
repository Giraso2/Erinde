from flask import Flask, render_template, session, redirect
from datetime import datetime

app = Flask(__name__)
app.secret_key="secret"


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
    return render_template("appointments.html")


@app.route("/history")
def history():
    return render_template("history.html")


app.run(debug=True)