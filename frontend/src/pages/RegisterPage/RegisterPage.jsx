import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../../context/UserContext";
import InputField from "../../components/InputField/InputField";
import logo from "../../assets/logo.png";
import "./RegisterPage.css";

const RegisterPage = () => {
  // Initialize state for form data, including fullname, username, password, and error message
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    errorMessage: "",
  });
  // Access setUserInfo from UserContext to update user information after registration
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate(); // Hook for navigation

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle registration form submission
  const handleRegister = async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Reset the error message before attempting registration
    setFormData((prev) => ({
      ...prev,
      errorMessage: "",
    }));

    try {
      // Make a POST request to the registration endpoint with the fullname, username, and password
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullname: formData.fullname,
            username: formData.username,
            password: formData.password,
          }),
        }
      );

      /**
       * Check if the response is not OK
       * Update error message if the username is already taken
       *
       */
      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.message === "Username already taken") {
          setFormData((prev) => ({
            ...prev,
            errorMessage: "Username already taken",
          }));
        } else {
          // Handle other registration failures
          setFormData((prev) => ({
            ...prev,
            errorMessage: "Registration failed. Please try again.",
          }));
        }
        return;
      }

      // If registration is successful, parse the user information from the response
      const userInfo = await res.json();

      // Update the user context with the newly registered user information
      setUserInfo(userInfo);
      // Redirect to the home page after successful registration
      navigate("/");
    } catch (err) {
      console.error("Error during registration:", err);
    }
  };

  return (
    <section className="register__card">
      <div className="register-side__wrapper">
        <img
          src={logo}
          alt="ShotSphere Logo"
          className="register-side__wrapper-icon"
        />
        <h1>ShotSphere</h1>
      </div>

      <div className="register__section">
        <h2>Sign Up</h2>
        <div className="register__tags">
          <p>Create an account!</p>
          <p>Start posting your stories and inspire others with your shots.</p>
        </div>

        <form className="register" onSubmit={handleRegister}>
          <InputField
            type={"text"}
            name={"fullname"}
            handle={"fullname"}
            placeholder={"Full Name"}
            value={formData.fullname}
            onChange={handleChange}
            className={"register__input"}
          />

          <InputField
            type={"text"}
            name={"username"}
            handle={"username"}
            placeholder={"Username"}
            value={formData.username}
            onChange={handleChange}
            className={`register__input ${
              formData.errorMessage ? "input-error" : ""
            }`}
          />

          <InputField
            type={"password"}
            name={"password"}
            handle={"password"}
            placeholder={"Password"}
            value={formData.password}
            onChange={handleChange}
            className={"register__input"}
          />

          {/* Conditionally render error message if it exists */}
          {formData.errorMessage && (
            <p className="error-message">{formData.errorMessage}</p>
          )}

          <button type="submit" className="signup__button">
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
