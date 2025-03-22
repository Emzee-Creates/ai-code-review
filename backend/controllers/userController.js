const getUserProfile = (req, res) => {
    res.json({ message: "Protected route accessed!", user: req.user.id });
};

module.exports = { getUserProfile };
