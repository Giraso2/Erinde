from flask import Flask, render_template, request, redirect, session

app = Flask(__name__)
app.secret_key="secret"


@app.route("/")
def home():
    return render_template("login.html")


@app.route("/login",methods=["POST"])
def login():

    email=request.form["email"]

    session["user"]=email

    return redirect("/user")


@app.route("/signup",methods=["POST"])
def signup():

    name=request.form["name"]
    email=request.form["email"]

    session["user"]=email

    return redirect("/user")


@app.route("/user")
def dashboard():

    if "user" in session:
        return render_template("user.html", user=session["user"])

    return redirect("/")


@app.route("/logout")
def logout():

    session.pop("user",None)

    return redirect("/")


app.run(debug=True)