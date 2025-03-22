document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
        const response = await fetch("https://ai-code-reviewer-backend-clrn.onrender.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = "login.html"; // Redirect to login page
        } else {
            errorMessage.textContent = data.message || "Signup failed!";
        }
    } catch (error) {
        errorMessage.textContent = "Server error. Try again later.";
    }
});
