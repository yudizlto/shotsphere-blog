// Load environment variables from a .env file into process.env
require("dotenv").config();

// Retrieve the server port from the environment variable, default to 4000 if not set
const PORT = process.env.PORT || 4000;

// Retrieve the base URL from the environment variable
const BASE_URL = process.env.BASE_URL;

// Retrieve the MongoDB connection URI from the environment variable
const MONGO_URI = process.env.MONGO_URI;

// Retrieve the secret key for JWT authentication from the environment variable
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Export the configuration variables to be used in other parts of the application:
 * MongoDB connection string
 * Server port number
 * JWT secret key
 * Base URL for the app
 */
module.exports = {
  mongoUri: MONGO_URI,
  port: PORT,
  jwtSecret: JWT_SECRET,
  baseUrl: BASE_URL,
};
