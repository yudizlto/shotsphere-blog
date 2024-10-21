const express = require("express");
const multer = require("multer"); // Library for handling file uploads
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");

// Set up Multer for file uploads, specifying the destination folder
const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Route for creating a new post, requires token verification and file upload
router.post("/create", verifyToken, upload.single("file"), createPost);

// Route to get all posts, open to public access
router.get("/", getPosts);

// Route to get a specific post by ID, open to public access
router.get("/:id", getPostById);

// Route to update a post, requires token verification and file upload
router.put("/:id", verifyToken, upload.single("file"), updatePost);

// Route to delete a post, requires token verification
router.delete("/:id", verifyToken, deletePost);

// Export the router to be used in other parts of the application
module.exports = router;
