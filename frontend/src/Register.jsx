import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Navbar from "./components/Navbar";
import axios from "axios";


function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Please fill out your username and password.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5002/register",
        {
            username,
            password,
        }
      );
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("There was an issue submitting your registration. Please try again.");
    }
  };

  return (
    <div className="home-app-container">
      <Navbar />
      <div className="home-content">
        <h1 className="text">Welcome to the Premier League Predictor Registration</h1>
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
              onChange={(e) => setUsername(e.target.value)} // Use onChange here
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
              onChange={(e) => setPassword(e.target.value)} // Use onChange here
            />
          </div>
          <br />
          <button onClick={handleRegistration}>Register</button>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default Register;
