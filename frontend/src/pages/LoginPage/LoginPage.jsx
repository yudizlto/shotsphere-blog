import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../../context/UserContext";
import InputField from "../../components/InputField/InputField";
import logo from "../../assets/logo.png";
import "./LoginPage.css";

const LoginPage = () => {
  // Initialize state for form data, including username, password, and error message
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    errorMessage: "",
  });
  // Access setUserInfo from UserContext to update user information after login
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate(); // Hook for navigation

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Reset the error message before attempting login
    setFormData((prev) => ({
      ...prev,
      errorMessage: "",
    }));

    try {
      // Make a POST request to the login endpoint with the username and password
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
        credentials: "include",
      });

      /**
       * Check if the response is not OK
       * Set specific error messages based on the error received from the server
       * Update error message for incorrect credentials
       * Update error message for incorrect password
       */
      if (!res.ok) {
        const errorData = await res.json();

        if (errorData.message === "Incorrect username or password") {
          setFormData((prev) => ({
            ...prev,
            errorMessage: "Incorrect username or password",
          }));
        } else if (errorData.message === "Incorrect password") {
          setFormData((prev) => ({
            ...prev,
            errorMessage: "Incorrect password",
          }));
        } else {
          // Handle unexpected errors
          setFormData((prev) => ({
            ...prev,
            errorMessage: "An unexpected error occurred. Please try again.",
          }));
        }
        return;
      }

      // If login is successful, parse the user information from the response
      const userInfo = await res.json();

      // Update the user context with the logged-in user information
      setUserInfo(userInfo);
      // Redirect to the home page after successful login
      navigate("/");
    } catch (err) {
      console.error("Login Failed:", err);
    }
  };

  return (
    <section className="login__card">
      <div className="login-side__wrapper">
        <img
          src={logo}
          alt="ShotSphere Logo"
          className="login-side__wrapper-icon"
        />
        <h1>ShotSphere</h1>
      </div>

      <div className="login__section">
        <h2>Welcome Back</h2>
        <div className="login__tags">
          <p>Your creative space awaits.</p>
          <p>Let's capture and share your unique perspective.</p>
        </div>

        <form className="login" onSubmit={handleLogin}>
          <InputField
            type={"text"}
            name={"username"}
            placeholder={"Username"}
            value={formData.username}
            onChange={handleChange}
            className={`login__input ${
              formData.errorMessage ? "input-error" : ""
            }`}
          />

          <InputField
            type={"password"}
            name={"password"}
            placeholder={"Password"}
            value={formData.password}
            onChange={handleChange}
            className={`login__input ${
              formData.errorMessage ? "input-error" : ""
            }`}
          />

          {/* Conditionally render error message if it exists */}
          {formData.errorMessage && (
            <p className="error-message">{formData.errorMessage}</p>
          )}

          <button type="submit" className="sign-in__button">
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
