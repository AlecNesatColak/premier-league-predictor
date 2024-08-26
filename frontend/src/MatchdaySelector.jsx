import React from "react";
import { useNavigate } from "react-router-dom";
import "./MatchdaySelector.css"; // You can create a CSS file for styling

const MatchdaySelector = () => {
  const navigate = useNavigate();

  // Handle clicking on a matchday box
  const handleMatchdayClick = (matchday) => {
    navigate(`/matchday/${matchday}`);
  };

  return (
    <div className="matchday-selector-container">
      <h1>Select a Matchday</h1>
      <div className="matchday-grid">
        {Array.from({ length: 38 }, (_, i) => (
          <div
            key={i + 1}
            className="matchday-box"
            onClick={() => handleMatchdayClick(i + 1)}
          >
            Matchday {i + 1}
          </div>
        ))}
      </div>
      <button
          onClick={navigate("/")}
          className="primary-button"
        >
          Go Home
        </button>
    </div>
  );
};

export default MatchdaySelector;
