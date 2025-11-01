const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Secret key for signing JWTs
const SECRET_KEY = "mysecretkey123";

// Hardcoded sample user
const user = {
  id: 1,
  username: "testuser",
  password: "password123",
};

// =====================
// LOGIN ROUTE
// =====================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check credentials
  if (username === user.username && password === user.password) {
    // Create JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// =====================
// JWT VERIFICATION MIDDLEWARE
// =====================
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(403).json({ message: "Token missing" });

  jwt.verify(token, SECRET_KEY, (err, userData) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = userData; // attach decoded data to request
    next();
  });
}

// =====================
// PROTECTED ROUTE
// =====================
app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Access granted to protected route!",
    user: req.user,
  });
});

// =====================
// START SERVER
// =====================
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
