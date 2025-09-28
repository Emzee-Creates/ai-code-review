document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
        const response = await fetch("https://ai-code-reviewer-backend-clrn.onrender.com/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // ✅ Store token + user in localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect to dashboard
            window.location.href = "dashboard.html";
        } else {
            errorMessage.textContent =
                data.msg || (data.errors && data.errors[0].msg) || "Signup failed!";
        }
    } catch (error) {
        errorMessage.textContent = "Server error. Try again later.";
        console.error("Signup error:", error);
    }
});
