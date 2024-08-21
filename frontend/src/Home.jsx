import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <div className="content">
        <h1>Welcome to the Premier League Predictor</h1>

        <button
          onClick={handleFormClick}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Go to Form
        </button>

        <div style={{ marginTop: "20px" }}>
          <label
            htmlFor="username"
            style={{ fontSize: "18px", marginBottom: "10px", display: "block" }}
          >
            Enter user name to see the prediction:
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter user name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              width: "200px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          />
          <br />
          <button
            onClick={handlePredictionClick}
            disabled={user.trim() === ""}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: user.trim() === "" ? "transparent" : "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: user.trim() === "" ? "not-allowed" : "pointer",
              marginLeft: "10px",
            }}
          >
            See Prediction
          </button>

          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
