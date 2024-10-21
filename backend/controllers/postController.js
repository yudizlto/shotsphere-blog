const Post = require("../models/Post");
const fs = require("fs");

// Function to create a new post
exports.createPost = async (req, res) => {
  // Extract file details from the uploaded file
  const { originalname, path } = req.file;

  // Get the file extension
  const ext = originalname.split(".").pop();

  // Create a new path for the file with the extension
  const newPath = `${path}.${ext}`;

  // Rename the uploaded file to include the extension
  fs.renameSync(path, newPath);

  // Extract post details from the request body
  const { title, summary, content } = req.body;

  /**
   * Create a new post with the provided data and the updated file path for the cover image
   * The author's ID is set from the authenticated user
   * Send the newly created post as a response
   */
  const postData = await Post.create({
    title,
    summary,
    content,
    cover: newPath,
    author: req.user.id,
  });

  res.json(postData);
};

// Function to get the latest posts
exports.getPosts = async (req, res) => {
  try {
    /**
     * Find the latest 15 posts, populate the author field with their username, and sort by creation date
     * Send the list of posts as a response
     * Send error response if something goes wrong
     */
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(15);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts", error: err });
  }
};

// Function to get a single post by its ID
exports.getPostById = async (req, res) => {
  // Extract the post ID from the request parameters
  const { id } = req.params;

  try {
    /**
     * Find the post by its ID and populate the author's username and ID
     * Send the post data as a response
     * If post not found, return 404
     * Send error response if something goes wrong
     */
    const post = await Post.findById(id).populate("author", [
      "username",
      "_id",
    ]);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post", error: err });
  }
};

// Function to update a post by its ID
exports.updatePost = async (req, res) => {
  // Extract the post ID from the request parameters
  const { id } = req.params;

  // Extract the updated details from the request body
  const { title, summary, content } = req.body;

  try {
    /**
     * Find the post by its ID, If post not found, return 404
     * Check if a new file is uploaded, if so, delete the old file and update the cover path
     */
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (req.file) {
      fs.unlink(post.cover, (err) => {
        if (err) console.error("Failed to delete old image:", err); // Log any errors during file deletion
      });

      const { originalname, path } = req.file; // Get the new file's name and path
      const ext = originalname.split(".").pop(); // Get the file extension
      const newPath = `${path}.${ext}`; // Update the new file path
      fs.renameSync(path, newPath); // Rename the new file with the extension
      post.cover = newPath; // Update the cover path in the post data
    }

    /**
     * Update the post's title, summary, and content
     * Save the updated post to the database
     * Send the updated post as a response
     * Send error response if something goes wrong
     */
    post.title = title;
    post.summary = summary;
    post.content = content;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Failed to update post", error: err });
  }
};

// Function to delete a post by its ID
exports.deletePost = async (req, res) => {
  // Extract the post ID from the request parameters
  const { id } = req.params;

  try {
    /**
     * Find and delete the post by its ID, If post not found, return 404
     * Delete the post's cover image from the server
     * Send success message
     * Send error response if something goes wrong
     */
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found" });

    fs.unlink(deletedPost.cover, (err) => {
      if (err) console.error("Failed to delete image:", err); // Log any errors during file deletion
    });

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post", error: err });
  }
};
