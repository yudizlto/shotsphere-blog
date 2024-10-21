const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 * Define the schema for a User:
 *
 * The full name of the user, required field
 * Username for login, required field with a minimum length of 4 characters, must be unique
 * Hashed password for user authentication, required field
 */
const UserSchema = new Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
});

// Create the User model using the schema
const UserModel = model("User", UserSchema);

// Export the User model to be used in other parts of the application
module.exports = UserModel;
