import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./DisplayPrediction.css";

const DisplayPrediction = () => {
  const navigate = useNavigate();
  const { user } = useParams(); // Get the user's name from the URL params
  const [prediction, setPrediction] = useState(null); // Store the user's prediction
  const [teamPositionMap, setTeamPositionMap] = useState({}); // Store team positions map
  const [positionsFetched, setPositionsFetched] = useState(false); // Check if positions are fetched
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeTeamName = (name) => {
    return name
      .toLowerCase()
      .replace(/fc|afc|[\W_]+/g, "") // Remove 'fc', 'afc', and non-alphanumeric characters
      .trim(); // Trim any leading/trailing spaces
  };

  // Fetch actual standings from Football Data API once and store in a local map
  const fetchActualPositions = async () => {
    try {
      const response = await axios.get(
        `https://premier-league-predictor-1.onrender.com/api/standings`
      );
      const standings = response.data.standings[0].table;

      const positionMap = {};
      let currentPosition = 1; // Start with the first position
      let previousPosition = null; // To track the previous position for comparison

      standings.forEach((standing, index) => {
        // Check if the previous team's position is the same as the current one
        if (previousPosition === standing.position) {
          currentPosition += 1; // Increment the position if the current one is tied
        } else {
          currentPosition = standing.position; // Assign the correct position if not tied
        }

        positionMap[standing.team.name] = currentPosition; // Map the team name to the adjusted position
        previousPosition = standing.position; // Update previousPosition to the current one

      });

      setTeamPositionMap(positionMap); // Store the position map with updated positions
      setPositionsFetched(true); // Indicate positions are fetched
    } catch (error) {
      console.error("Error fetching data:", error); // Log the full error
      setError("Error fetching data from Football Data API.");
    }
  };

  // Function to get the actual position of the team from the local data structure
  const getActualPosition = (teamName) => {
    const normalizedPredictionName = normalizeTeamName(teamName);

    // Loop over the teamPositionMap entries
    for (const [apiTeamName, position] of Object.entries(teamPositionMap)) {
      const normalizedApiTeamName = normalizeTeamName(apiTeamName);

      // Log the normalized API team name and try to match
      if (normalizedApiTeamName.includes(normalizedPredictionName)) {
        //console.log(
          //`Matched: ${normalizedPredictionName} with ${normalizedApiTeamName}`
        //);
        return position; // Return the found position
      }
    }

    return "Not found: N/A"; // Return "N/A" if not found
  };

  // Fetch the user's prediction from the backend
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await axios.get(
          `https://premier-league-predictor-1.onrender.com/api/prediction/${user}`
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app-container">
      <div className="left-side"></div>
      <div className="right-side"></div>
      <div className="display-form-content">
        <h1 className="text">{user}'s Premier League Prediction</h1>
        <div>
          <button
            onClick={() => navigate("/")}
            style={{
              width: 150,
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Go Back to Home
          </button>
        </div>
        {prediction && (
          <div className="table-container">
            <div className="team-column">
              {prediction.teams.slice(0, 10).map((team, index) => {
                const actualPosition = getActualPosition(team.name); // Get the actual position of the team
                return (
                  <div key={index} className="draggable-item">
                    <img src={team.logo} alt={`${team.name} logo`} width="40" />
                    <span>{team.name}</span>
                    <span className="actual-position">
                      {actualPosition}
                    </span>{" "}
                    {/* Actual position on the right */}
                  </div>
                );
              })}
            </div>

            <div className="team-column">
              {prediction.teams.slice(10, 20).map((team, index) => {
                const actualPosition = getActualPosition(team.name); // Get the actual position of the team
                return (
                  <div key={index} className="draggable-item">
                    <img src={team.logo} alt={`${team.name} logo`} width="40" />
                    <span>{team.name}</span>
                    <span className="actual-position">
                      {actualPosition}
                    </span>{" "}
                    {/* Actual position on the right */}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayPrediction;
