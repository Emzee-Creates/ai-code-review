const express = require("express");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware.js");
const User = require("../models/User");

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get logged-in user details
// @access  Private
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ message: "Protected route accessed!", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/user/profile
// @desc    Update user details
// @access  Private
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    let user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Rename variables to avoid redeclaration issues
    const { name: newName, email: newEmail, password: newPassword } = req.body;

    if (newName) user.name = newName;
    if (newEmail) user.email = newEmail;
    
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    
    const { _id, name, email } = user; // Extract only necessary fields

    res.json({ message: "User updated successfully", user: { _id, name, email } });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;
