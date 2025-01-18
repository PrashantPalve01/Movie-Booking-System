document.getElementById("loginForm").addEventListener("submit", login);

function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const API_KEY = 'AIzaSyAnupteovip3CSUZlyv8sp5qgjw61C6HQM';

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
        })
    };

    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, requestOptions)
        .then(resp => resp.json())
        .then(res => {
            if (res.idToken) 
            {
                localStorage.setItem("user", JSON.stringify(email))
                window.location.href = "home.html";
            } else {
                alert(res.error.message || "Login failed");
            }
        })
        .catch(err => console.error("Error:", err));
}