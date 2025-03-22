document.addEventListener("DOMContentLoaded", () => {
    const userNameSpan = document.getElementById("userName");
    const codeInput = document.getElementById("codeInput");
    const submitButton = document.getElementById("submitCode");
    const clearReviewButton = document.getElementById("clearReview");
    const reviewOutput = document.getElementById("reviewOutput");
    const logoutButton = document.getElementById("logoutBtn");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const recentReviewsList = document.getElementById("recentReviews");

    if (!recentReviewsList) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
        redirectToLogin("Session expired. Please log in again.");
        return;
    }

    console.log("🔑 Stored Token:", user.token); // ✅ Debugging step

    userNameSpan.textContent = user.name;

    function isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1])); 
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    }

    if (isTokenExpired(user.token)) {
        redirectToLogin("Session expired. Please log in again.");
        return;
    }

    // 🌙 Dark Mode Toggle
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    });

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    // 🔑 Logout
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
    });

    let isSubmitting = false;

    // 📡 WebSocket Connection
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
        console.log("✅ Connected to WebSocket");
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            
            if (data.type === "reviewUpdate") {
                console.log("📩 New review received:", data.review);
                reviewOutput.innerHTML = formatReview(data.review);
                saveRecentReview(data.review);
            } else {
                console.warn("⚠️ Unexpected WebSocket message:", data);
            }
        } catch (error) {
            console.warn("⚠️ Ignored non-JSON WebSocket message:", event.data);
        }
    };

    ws.onclose = () => {
        console.log("❌ WebSocket Disconnected");
    };

    ws.onerror = (error) => {
        console.error("⚠️ WebSocket Error:", error);
    };

    // 📝 Submit Code for Review
    submitButton.addEventListener("click", async () => {
        if (isSubmitting) return;
        const code = codeInput.value.trim();
        if (code === "") {
            alert("Please enter some code to review.");
            return;
        }

        submitButton.textContent = "Reviewing...";
        submitButton.disabled = true;
        isSubmitting = true;

        console.log("📡 Sending token in API request:", user.token); // ✅ Debugging step

        try {
            const response = await fetch("https://ai-code-reviewer-2w6f.onrender.com/api/code/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify({ code })
            });

            console.log("🔍 Response Status:", response.status); // ✅ Debugging step

            if (response.status === 401) {
                redirectToLogin("Session expired. Please log in again.");
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || "Failed to get a review. Please try again.");
            }

            const data = await response.json();
            reviewOutput.innerHTML = formatReview(data.review);
            saveRecentReview(data.review);

            // 🔹 Send update to WebSocket server
            ws.send(JSON.stringify({ type: "newReview", review: data.review }));

        } catch (error) {
            reviewOutput.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        } finally {
            submitButton.textContent = "Submit for Review";
            submitButton.disabled = false;
            isSubmitting = false;
        }
    });

    clearReviewButton.addEventListener("click", () => {
        reviewOutput.innerHTML = "";
    });

    function redirectToLogin(message) {
        alert(message);
        localStorage.removeItem("user");
        window.location.href = "login.html";
    }

    function formatReview(review) {
        if (!review || typeof review !== "string") return "<p style='color:red;'>Invalid review data</p>";

        return review
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")  
            .replace(/```([^`]+)```/g, "<pre><code>$1</code></pre>")  
            .replace(/\n/g, "<br>");  
    }

    function saveRecentReview(review) {
        if (!review || typeof review !== "string") return;

        let reviews = JSON.parse(localStorage.getItem("recentReviews") || "[]");

        if (!Array.isArray(reviews)) reviews = [];

        reviews.unshift({ text: review, timestamp: new Date().toLocaleString() });

        reviews = reviews.slice(0, 5); 

        localStorage.setItem("recentReviews", JSON.stringify(reviews));

        displayRecentReviews();
    }

    function displayRecentReviews() {
        let reviews = JSON.parse(localStorage.getItem("recentReviews") || "[]");

        if (!Array.isArray(reviews)) reviews = [];

        recentReviewsList.innerHTML = "";  

        if (reviews.length === 0) {
            recentReviewsList.innerHTML = "<p>No recent reviews available.</p>";
            return;
        }

        reviews.forEach((review, index) => {
            const li = document.createElement("li");
            li.innerHTML = `<b>Review #${index + 1}</b> - ${review.timestamp}: ${formatReview(review.text)}`;
            recentReviewsList.appendChild(li);
        });
    }

    displayRecentReviews();
});
