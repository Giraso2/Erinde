// Get users from local storage or create empty array
let users = JSON.parse(localStorage.getItem("users")) || [];

// ================= REGISTER =================
function register() {

    let username = document.getElementById("signupUsername").value;
    let email = document.getElementById("signupEmail").value;
    let password = document.getElementById("signupPassword").value;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username || users[i].email === email) {
            document.getElementById("message").innerHTML = "User already exists!";
            return;
        }
    }

    users.push({
        username: username,
        email: email,
        password: password
    });

    localStorage.setItem("users", JSON.stringify(users));

    // Save logged-in user
    localStorage.setItem("loggedInUser", username);

    // Redirect to dashboard
    window.location.href = "dashboard.html";
}


// ================= LOGIN =================
function login() {

    let input = document.getElementById("loginUser").value;
    let password = document.getElementById("loginPassword").value;

    for (let i = 0; i < users.length; i++) {

        if ((users[i].username === input || users[i].email === input)
            && users[i].password === password) {

            // Save logged in user
            localStorage.setItem("loggedInUser", users[i].username);

            // Redirect to dashboard
            window.location.href = "dashboard.html";
            return;
        }
    }

    document.getElementById("message").innerHTML = "Invalid login details!";
}


// ================= DASHBOARD =================
function loadDashboard() {

    let user = localStorage.getItem("loggedInUser");

    if (!user) {
        // If not logged in → return to login page
        window.location.href = "index.html";
    } else {
        document.getElementById("welcome").innerHTML =
            "Welcome to your dashboard, " + user + "!";
    }
}


// ================= LOGOUT =================
function logout() {

    localStorage.removeItem("loggedInUser");

    window.location.href = "index.html";
}