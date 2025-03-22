document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("🔑 Server Response:", data); // ✅ Debugging log

        if (!response.ok) {
            errorMessage.textContent = data.message || "Invalid credentials!";
            return;
        }

        if (!data || !data.token) {
            errorMessage.textContent = "Login failed: No token received.";
            return;
        }

        const userData = { name: data.name || "User", token: data.token };
        localStorage.setItem("user", JSON.stringify(userData));

        console.log("✅ User stored:", localStorage.getItem("user")); // ✅ Confirm it's saved
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("⚠️ Login Error:", error);
        errorMessage.textContent = "Server error. Try again later.";
    }
});
