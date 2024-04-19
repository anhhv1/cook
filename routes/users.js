var express = require("express");
var jwt = require("jsonwebtoken");
var csrf = require("csurf");
var router = express.Router();
const requireAuth = require("../middlewares/requireAuth");

// CSRF middleware
var csrfProtection = csrf({ cookie: true });

// Example fixed set of credentials (for demonstration purposes)
const fixedCredentials = {
  username: "user123",
  password: "password123",
  userId: "123456",
  balance: 1000,
};
/* POST login route. */
router.post("/login", function (req, res, next) {
  // Removed csrfProtection middleware from here
  const { username, password } = req.body;

  // Check if username and password match the fixed credentials
  if (
    username === fixedCredentials.username &&
    password === fixedCredentials.password
  ) {
    // If credentials are valid, sign a JWT containing userId and balance
    const token = jwt.sign(
      {
        userId: fixedCredentials.userId,
        balance: fixedCredentials.balance,
      },
      "your_secret_key_here", // Replace with your own secret key for signing JWTs
      { expiresIn: "1h" } // Token expiration time
    );

    // Set the JWT as an HTTP-only and secure cookie
    // Set the JWT as an HTTP-only and secure cookie with an expiration time
    res.cookie("__auth", token, {
      httpOnly: true,
      maxAge: new Date(Date.now() + 3600000),
      expires: new Date(Date.now() + 3600000),
      path: "/"
    });

    // Respond with success message
    res.status(200).json({ message: "Login successful" });
  } else {
    // If credentials are invalid, respond with error message
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Example protected route with CSRF token and requireAuth middleware
router.get("/protected", requireAuth, function (req, res) {
  // Access the decoded payload from req.user
  const userId = req.user.userId;
  const balance = req.user.balance;

  res.status(200).json({ userId, balance });
});

module.exports = router;
