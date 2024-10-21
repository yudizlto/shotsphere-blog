import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EditorText from "../../components/EditorText/EditorText";
import "./EditPostPage.css";

const EditPostPage = () => {
  const { id } = useParams(); // Get post ID from URL parameters
  // Grouping post-related states into a single object
  const [postData, setPostData] = useState({
    title: "",
    summary: "",
    content: "",
    files: null,
  });
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    /**
     * Fetch post data when the component mounts or when the ID changes
     * Set fetched data to state
     */
    fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`).then((res) => {
      res.json().then((postInfo) => {
        setPostData({
          title: postInfo.title,
          summary: postInfo.summary,
          content: postInfo.content,
          files: null,
        });
      });
    });
  }, [id]);

  // Function to handle post editing
  const editThisPost = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const data = new FormData();
    data.set("title", postData.title);
    data.set("summary", postData.summary);
    data.set("content", postData.content);
    data.set("id", id);

    if (postData.files?.[0]) {
      data.set("file", postData.files?.[0]);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/posts/${id}`,
        {
          method: "PUT",
          body: data,
          credentials: "include",
        }
      );

      if (response.ok) {
        // Navigate to the updated post page
        navigate(`/post/${id}`);
      } else {
        const errorMessage = await response.text();
        console.error("Failed to edit post:", errorMessage);
        alert("Failed to edit post: " + errorMessage);
      }
    } catch (err) {
      console.error("Error editing post:", err);
      alert("An error occurred: " + err.message);
    }
  };

  // Function to handle changes in post inputs
  const handleInputChange = (e) => {
    // Destructure name and value from the event target
    const { name, value } = e.target;

    setPostData((prev) => ({
      ...prev,
      [name]: value, // Update the corresponding field in the post object
    }));
  };

  // Function to handle file input change
  const handleFileChange = (e) => {
    setPostData((prevPost) => ({
      ...prevPost,
      files: e.target.files, // Update files state with the selected files
    }));
  };

  return (
    <form className="edit-post" onSubmit={editThisPost}>
      <h2 className="edit-post__title">Edit Post</h2>
      <div className="edit-post__input-group">
        <input
          type="text"
          name="title"
          className="edit-post__input"
          placeholder="Title"
          value={postData.title}
          onChange={handleInputChange}
        />
      </div>

      <div className="edit-post__input-group">
        <input
          type="text"
          name="summary"
          className="edit-post__input"
          placeholder="Summary"
          value={postData.summary}
          onChange={handleInputChange}
        />
      </div>

      <div className="edit-post__input-group">
        <input
          type="file"
          className="edit-post__file-input"
          onChange={handleFileChange}
        />
      </div>

      <div className="edit-post__editor">
        <EditorText value={postData.content} onChange={handleInputChange} />
      </div>

      <button type="submit" className="edit-post__button">
        Edit Post
      </button>
    </form>
  );
};

export default EditPostPage;
