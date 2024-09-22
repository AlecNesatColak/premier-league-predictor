import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Please fill out your username and password.");
      return;
    }
    try {
      // Send login request to the backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_PROD}/login`,
        {
          username,
          password,
        }
      );

      // Extract the token from the response
      const { token } = response.data;

      //console.log("Token:", token);

      // Save the token in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("username", username);

      // Redirect the user after login
      alert("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Error logging in user:", error);
      setError(
        error.response?.data?.error ||
          "There was an issue logging in. Please try again."
      );
    }
  };

  return (
    <div className="home-app-container">
      <div className="home-content">
        <h1 className="text">Welcome to the Premier League Predictor Login</h1>
        <div>
          <div>
            <label htmlFor="username" className="text">
              Enter a username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="text" htmlFor="password">
              Enter a password
            </label>
            <input
              className="password"
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <br />
          <button className="button" onClick={handleLogin}>
            Login
          </button>
          {error && <div className="error-message">{error}</div>}
          <p>Need to make an Account?</p>
          <button className="button" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
