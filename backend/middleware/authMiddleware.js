const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  console.log("Headers received:", req.headers); 

  const authHeader = req.header("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next(); // ✅ Allow access
  } catch (err) {
    res.status(401).json({ msg: "Invalid or expired token." });
  }
};
