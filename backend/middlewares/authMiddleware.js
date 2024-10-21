// Import the jsonwebtoken library for handling JWTs
const jwt = require("jsonwebtoken");

// Import the secret key for JWT verification
const { jwtSecret } = require("../config/config");

/**
 * Middleware function to verify the JWT token from the cookies
 * and ensure the user is authenticated.
 *
 * @param {Object} req - Express request object, which contains the cookies
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyToken = (req, res, next) => {
  // Retrieve the token from cookies
  const token = req.cookies.token;
  // If no token is found, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  /**
   * Verify the JWT token using the secret key
   * If the token is invalid or expired, return a 401 response
   * If the token is valid, attach the decoded information (user data) to the request object
   */
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;

    // Call the next middleware function
    next();
  });
};

// Export the verifyToken middleware function
module.exports = { verifyToken };
