import { useState } from "react";
import { useNavigate } from "react-router-dom";

import EditorText from "../../components/EditorText/EditorText";
import "./CreatePostPage.css";

const CreatePostPage = () => {
  // Grouping post-related states into a single object
  const [post, setPost] = useState({
    title: "",
    summary: "",
    content: "",
    files: "",
  });
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle form submission and create a new post
  const createNewPost = async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    /**
     * Create a new FormData object for file upload:
     *
     * Append title, summary, content and the 1st file from the selected files to FormData
     */
    const data = new FormData();
    data.set("title", post.title);
    data.set("summary", post.summary);
    data.set("content", post.content);
    data.set("file", post.files[0]);

    try {
      /**
       * Sending a POST request to create a new post
       * If the response is okay, navigate to the home page
       * Log any errors that occur during the fetch request
       */

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/posts/create`, // API endpoint for creating posts
        {
          method: "POST",
          body: data,
          // Include credentials (cookies) with the request
          credentials: "include",
        }
      );

      if (response.ok) {
        navigate("/");
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  // Function to handle changes in post inputs
  const handleInputChange = (e) => {
    // Destructure name and value from the event target
    const { name, value } = e.target;

    setPost((prevPost) => ({
      ...prevPost,
      [name]: value, // Update the corresponding field in the post object
    }));
  };

  // Function to handle file input change
  const handleFileChange = (e) => {
    setPost((prevPost) => ({
      ...prevPost,
      files: e.target.files, // Update files state with the selected files
    }));
  };

  return (
    <form className="create-post" onSubmit={createNewPost}>
      <h2 className="create-post__title">Create a New Post</h2>
      <div className="create-post__input-group">
        <input
          type="text"
          name="title" // Name attribute for identifying the input
          className="create-post__input"
          placeholder="Title"
          value={post.title}
          onChange={handleInputChange}
        />
      </div>

      <div className="create-post__input-group">
        <input
          type="text"
          name="summary" // Name attribute for identifying the input
          className="create-post__input"
          placeholder="Summary"
          value={post.summary}
          onChange={handleInputChange}
        />
      </div>

      <div className="create-post__input-group">
        <input
          type="file"
          className="create-post__file-input"
          onChange={handleFileChange}
        />
      </div>

      <div className="create-post__editor">
        <EditorText
          value={post.content}
          onChange={(newValue) =>
            setPost((prevPost) => ({ ...prevPost, content: newValue }))
          }
        />
      </div>

      <button type="submit" className="create-post__button">
        Create Post
      </button>
    </form>
  );
};

export default CreatePostPage;
