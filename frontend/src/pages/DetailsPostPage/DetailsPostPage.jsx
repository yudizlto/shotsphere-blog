import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { UserContext } from "../../context/UserContext";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import "./DetailsPostPage.css";

const DetailsPostPage = () => {
  const { id } = useParams(); // Get post ID from URL parameters
  const { userInfo } = useContext(UserContext); // Access user information from context
  const [postInfo, setPostInfo] = useState(null); // State to hold post information
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the confirmation modal
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    /**
     * Fetch post data from the server when the component mounts or when the ID changes
     * Parse the JSON response
     * Set the fetched data to state
     */
    const fetchPost = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/posts/${id}` // API call to fetch post details by ID
      );
      const data = await response.json();
      setPostInfo(data);
    };

    // Call the function to fetch post data
    fetchPost();
  }, [id]);

  // Function to delete the post
  const deletePost = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      // Navigate back to the home page after deletion
      navigate("/");
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  // If post information is not yet loaded, return an empty string to prevent rendering
  if (!postInfo) return "";

  const isUserLoggedIn = userInfo && userInfo.id;

  return (
    <section className="details-post">
      <div className="details-post__header">
        <h1 className="details-post__title">{postInfo.title}</h1>
        <div className="details-post__info">
          <span className="details-post__author">
            Written by: @{postInfo.author.username}
          </span>
          <span className="details-post__date">
            {new Date(postInfo.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Render edit and delete options if the logged-in user is the author of the post */}
      {isUserLoggedIn && userInfo.id === postInfo.author._id && (
        <div className="details-post__options">
          <div className="details-post__edit-button">
            <Link
              className="details-post__edit-link"
              to={`/edit/${postInfo._id}`}
            >
              Edit this post
            </Link>
          </div>
          <div className="details-post__delete-button">
            <button
              className="details-post__delete-link"
              onClick={() => setIsModalOpen(true)}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <ConfirmationModal
        message="Do you really want to delete this post? This action cannot be undone."
        buttonTitle="Delete"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={deletePost}
      />

      <div className="details-post__image-container">
        <img
          className="details-post__image"
          src={`${process.env.REACT_APP_BASE_URL}/${postInfo.cover}`}
          alt="Post Cover"
        />
      </div>

      <div
        className="details-post__content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </section>
  );
};

export default DetailsPostPage;
