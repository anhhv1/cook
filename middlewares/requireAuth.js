var jwt = require("jsonwebtoken");

// Middleware function to require authentication
function requireAuth(req, res, next) {
  // Get the JWT token from the cookie
  const token = req.cookies.__auth;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, "your_secret_key_here"); // Replace with your own secret key

    // Attach the decoded payload to the request object
    req.user = decoded;

    // Move to the next middleware or route handler
    next(); 
  } catch (error) {
    // If token verification fails, respond with an error
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

module.exports = requireAuth;
