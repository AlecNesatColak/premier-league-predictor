import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [error, setError] = useState("");

  const handleFormClick = () => {
    navigate("/form");
  };

  const handlePredictionClick = () => {
    if (user.trim() === "") {
      setError("Please enter a user name to see the prediction.");
      return;
    }
    setError("");
    navigate(`/prediction/${user}`);
  };

  return (
    <div className="app-container">
      <div className="left-side"></div>
      <div className="right-side"></div>
      <div className="home-content">
        <h1 className="text">Welcome to the Premier League Predictor</h1>

        <button
          onClick={handleFormClick}
          className="primary-button"
        >
          Go to Form
        </button>

        <div style={{ marginTop: "20px" }}>
          <label htmlFor="username" className="text">
            Enter user name to see the prediction:
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter user name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="input-field"
          />
          <br />
          <button
            onClick={handlePredictionClick}
            disabled={user.trim() === ""}
            className={`primary-button ${user.trim() === "" ? "disabled" : ""}`}
          >
            See Prediction
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default Home;
