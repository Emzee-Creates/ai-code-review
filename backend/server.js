require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const http = require("http");
const axios = require("axios"); // Added Axios for API calls
const codeReviewRoutes = require("./routes/codeReviewRoutes");

const app = express();
const server = http.createServer(app); // Create an HTTP server

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api", codeReviewRoutes);

// 🔹 FastAPI AI Review API URL (Render Deployment)
const AI_API_URL = "https://ai-code-reviewer-2w6f.onrender.com";

// ✅ New Route: Forward Code Review Requests to FastAPI
app.post("/api/code/review", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Code is required" });

    const response = await axios.post(`${AI_API_URL}/api/code/review`, { code });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error calling AI API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch AI review." });
  }
});

// WebSocket Server Setup
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔗 New WebSocket Connection");

  ws.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message);

      if (parsedMessage.type === "newReview") {
        // ✅ Only send valid JSON, no extra echoing
        const reviewUpdate = JSON.stringify({ type: "reviewUpdate", review: parsedMessage.review });

        wss.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(reviewUpdate);
          }
        });
      }
    } catch (error) {
      console.error("⚠️ Error parsing WebSocket message:", error);
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON format" }));
    }
  });

  ws.on("close", () => {
    console.log("❌ WebSocket Disconnected");
  });
});

// Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
