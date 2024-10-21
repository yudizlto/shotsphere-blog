const express = require("express");
const cors = require("cors"); // Import CORS middleware for enabling CORS
const mongoose = require("mongoose"); // Import Mongoose for MongoDB interactions
const cookieParser = require("cookie-parser"); // Import cookie-parser middleware

// Import route handlers for authentication and post management
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// Load configuration variables
const { mongoUri, baseUrl } = require("./config/config");

// Initialize the Express application
const app = express();

/**
 * Middleware configuration
 * Enable CORS with credentials support and set the allowed origin
 */
app.use(cors({ credentials: true, origin: baseUrl }));

// Enable cookie parsing for handling cookies in requests
app.use(cookieParser());

// Enable JSON body parsing for incoming requests
app.use(express.json());

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(__dirname + "/uploads"));

/**
 * Set up API routes:
 *
 * Routes for authentication
 * Routes for managing posts
 *
 */
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Connect to the MongoDB database using the specified URI
mongoose.connect(mongoUri);

// Export the configured Express application for use in the server startup file
module.exports = app;
