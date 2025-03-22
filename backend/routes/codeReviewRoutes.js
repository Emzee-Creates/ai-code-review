const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure this exists

const router = express.Router();

// POST /api/code/review - Sends code to FastAPI for review
router.post("/code/review", authMiddleware, async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: "Code is required" });
        }

        // Forward the request to FastAPI
        const fastApiResponse = await axios.post("http://127.0.0.1:8000/review", { code });

        res.json({ review: fastApiResponse.data.review });
    } catch (error) {
        console.error("Error calling AI review API:", error.message);
        res.status(500).json({ error: "Failed to process AI review" });
    }
});

module.exports = router;
