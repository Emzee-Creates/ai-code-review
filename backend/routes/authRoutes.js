const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();

// Helper function to generate JWT token
const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined!");
    }
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// POST /signup
router.post(
    "/signup",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Enter a valid email"),
        body("password").isLength({ min: 4 }).withMessage("Password must be at least 4 characters"),
    ],
    async (req, res) => {
        console.log("Signup request received:", req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ name, email, password: hashedPassword });

            await user.save();
            console.log("User saved successfully:", user);

            const token = generateToken(user.id);
            res.json({ token, user: { id: user.id, name, email } });

        } catch (err) {
            console.error("Error during signup:", err.message);
            res.status(500).send("Server Error!");
        }
    }
);

// POST /login
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Enter a valid email"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
        console.log("Login request received:", req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Invalid credentials" });
            }

            const token = generateToken(user.id);
            res.json({ token, user: { id: user.id, name: user.name, email: user.email } });

        } catch (err) {
            console.error("Error during login:", err.message);
            res.status(500).send("Server Error");
        }
    }
);

// GET /verify-token - Verify user authentication
router.get("/verify-token", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

    if (!token) {
        return res.status(401).json({ msg: "No token provided, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ user });
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(401).json({ msg: "Invalid token" });
    }
});

module.exports = router;
