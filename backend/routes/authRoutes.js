const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  logout,
} = require("../controllers/authController");

// Route for registering a new user
router.post("/register", register);

// Route for user login
router.post("/login", login);

// Route to get the profile of the authenticated user, requires token verification
router.get("/profile", verifyToken, getProfile);

// Route for logging out the user
router.post("/logout", logout);

// Export the router to be used in other parts of the application
module.exports = router;
