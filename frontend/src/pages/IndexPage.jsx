import { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import Post from "../components/Post/Post";
import EmptyState from "../components/EmptyState/EmptyState";

const IndexPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch posts from the API
        const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`);

        /**
         * Check if the response is not ok
         * Throw an error for failed responses
         *
         */
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        // Update the posts state with the fetched data
        setPosts(data);

        // Simulate loading delay for 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
          textAlign: "center",
        }}
      >
        <ClipLoader color="#333" loading={loading} size={50} />
      </div>
    );
  }

  // Render posts or empty state based on the number of posts
  return (
    <>
      {posts.length > 0 ? (
        posts.map((post) => <Post {...post} key={post._id} />)
      ) : (
        <EmptyState />
      )}
    </>
  );
};

export default IndexPage;
