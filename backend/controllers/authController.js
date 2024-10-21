const bcrypt = require("bcryptjs"); // Library for password hashing
const jwt = require("jsonwebtoken"); // Library for creating and verifying JSON Web Tokens (JWT)
const User = require("../models/User"); // User model for interacting with the database
const { jwtSecret } = require("../config/config"); // Secret key for JWT signing

const salt = bcrypt.genSaltSync(10); // Generate a salt for hashing passwords

// User registration function
exports.register = async (req, res) => {
  // Extract user data from the request
  const { fullname, username, password } = req.body;

  try {
    /**
     * Check if a user with the same username already exists
     * If the user exists, send a 409 status (Conflict) response
     */

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Create a new user with hashed password and save it to the database
    const userData = await User.create({
      fullname,
      username,
      // Hash the password with the generated salt
      password: bcrypt.hashSync(password, salt),
    });

    // Send the created user data as the response
    res.json(userData);
  } catch (err) {
    // If there is an error, send a 400 status (Bad Request) with the error details
    res.status(400).json(err);
  }
};

// User login function
exports.login = async (req, res) => {
  // Extract login credentials from the request
  const { username, password } = req.body;

  try {
    /**
     * Find the user in the database by username
     * If the user is not found, send a 400 status with a message
     */

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorrect username or password" });
    }

    /**
     * Compare the provided password with the stored hashed password
     * If the password is incorrect, send a 400 status with a message
     */
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ username, id: user._id }, jwtSecret, {});

    // Send the token as a cookie in the response
    res.cookie("token", token).json({ id: user._id, username });
  } catch (err) {
    // Log the error and send a 400 status with a generic message
    console.error("Login error:", err);
    res.status(400).json("Invalid credentials");
  }
};

// Function to get user profile information
exports.getProfile = (req, res) => {
  // Extract token from cookies
  const token = req.cookies.token;

  // If no token is provided, send a 401 status (Unauthorized)
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the provided JWT token
  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) {
      // If the token is invalid, send a 403 status (Forbidden)
      return res.status(403).json({ message: "Invalid token" });
    }

    try {
      /**
       * Find the user by ID and exclude the password field
       * Send the user data as the response
       * If the user is not found, send a 404 status (Not Found)
       * If there is an error, log it and send a 500 status (Internal Server Error)
       */

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

// User logout function
exports.logout = (req, res) => {
  // Clear the authentication token cookie and send a 200 status (OK)
  res
    .cookie("token", "", { httpOnly: true, secure: true })
    .status(200)
    .json({ message: "Logged out successfully" });
};
