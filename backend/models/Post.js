const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 * Define the schema for a Post:
 *
 * The title of the post, required field
 * A brief summary or description of the post
 * The main content of the post, required field
 * Path or URL of the cover image for the post
 * Reference to the user who authored the post, associated with the User model
 * Automatically add createdAt and updatedAt fields to the document
 *
 */
const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: String,
    content: { type: String, required: true },
    cover: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Create the Post model using the schema
const PostModel = model("Posts", PostSchema);

// Export the Post model to be used in other parts of the application
module.exports = PostModel;
