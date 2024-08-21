import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const DisplayPrediction = () => {
  const navigate = useNavigate();
  const { user } = useParams(); // Get the user's name from the URL params
  const [prediction, setPrediction] = useState(null); // Store the user's prediction
  const [teamPositionMap, setTeamPositionMap] = useState({}); // Store team positions map
  const [positionsFetched, setPositionsFetched] = useState(false); // Check if positions are fetched
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch actual standings from Football Data API once and store in a local map
  const fetchActualPositions = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/api/standings`);
      console.log("API Response Data: ", response.data);
      const standings = response.data.standings[0].table;

      // Create a map of team names to their positions
      const positionMap = {};
      standings.forEach((standing) => {
        positionMap[standing.team.name] = standing.position;
      });

      setTeamPositionMap(positionMap); // Store the position map
      setPositionsFetched(true); // Indicate positions are fetched
    } catch (error) {
      console.error("Error fetching data:", error); // Log the full error
      setError("Error fetching data from Football Data API.");
    }
  };

  // Fetch the user's prediction from the backend
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5002/api/prediction/${user}`
        );
        setPrediction(response.data.data); // Store the user's prediction
      } catch (err) {
        setError("Error fetching prediction.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
    fetchActualPositions(); // Call to fetch positions
  }, [user]);

  // Function to get the actual position of the team from the local data structure
  const getActualPosition = (teamName) => {
    if (!positionsFetched || !teamPositionMap) return "Not Fetched"; // Check if positions have been fetched
    return teamPositionMap[teamName] || "N/A"; // Return position or "N/A" if not found
  };

  // Update the item styling for display prediction list to match `PredictionForm`
  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: 16,
    margin: `0 0 8px 0`,
    background: isDragging ? "lightgreen" : "#fff",
    borderRadius: "5px",
    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    ...draggableStyle,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="App">
      <h1>{user}'s Premier League Prediction</h1>
      {prediction && (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {prediction.teams.map((team, index) => {
            const actualPosition = getActualPosition(team.name); // Get the actual position of the team

            return (
              <li
                key={index}
                style={getItemStyle(false, {})} // Reuse the item style from `PredictionForm`
              >
                <img
                  src={team.logo}
                  alt={`${team.name} logo`}
                  width="40"
                  style={{ marginRight: "10px" }}
                />
                <span>
                  {team.name} - User's Prediction: {index + 1}, Actual Position:{" "}
                  {actualPosition}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <div>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Go Back to Home
        </button>
        <br />
        <button
          onClick={() => navigate("/form")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Go to Form
        </button>
      </div>
    </div>
  );
};

export default DisplayPrediction;
