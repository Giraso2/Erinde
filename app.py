from flask import Flask, render_template, session, redirect

app = Flask(__name__)
app.secret_key="secret"


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html", user=session.get("user"))


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