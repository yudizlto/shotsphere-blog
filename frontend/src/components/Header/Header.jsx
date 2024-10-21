import { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../../context/UserContext";
import shotsphereLogo from "../../assets/logo.png";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import "./Header.css";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  // Get the username from userInfo, if available
  const username = userInfo?.username;

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/auth/profile`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        // Check if the response is not ok
        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }

        // Parse the response data as JSON
        const userInfo = await res.json();
        // Update userInfo in context
        setUserInfo(userInfo);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [setUserInfo]);

  // Function to handle user logout
  const handleLogout = () => {
    fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
      credentials: "include",
      method: "POST",
    });
    // Clear user info in context
    setUserInfo(null);
    // Close the logout confirmation modal
    setIsModalOpen(false);
    // Redirect to the home page
    navigate("/");
  };

  return (
    <header className="app__header">
      <Link to="/" className="app__logo">
        <img src={shotsphereLogo} alt="ShotSphere Logo" />
        ShotSphere
      </Link>
      <nav className="app__nav">
        {username ? (
          <>
            <Link to="/create" className="create__button">
              Create new post
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="logout__button"
            >
              {`@${username}`} | Logout
            </button>
            <ConfirmationModal
              message={"Do you really want to log out from this page ?"}
              buttonTitle={"Yes"}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleLogout}
            />
          </>
        ) : (
          <>
            <Link to="/login" className="login__button">
              Login
            </Link>
            <Link to="/register" className="register__button">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
