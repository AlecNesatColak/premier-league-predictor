import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./DisplayPrediction.css";

const DisplayPrediction = () => {
  const navigate = useNavigate();
  const { user } = useParams();
  const [prediction, setPrediction] = useState(null);
  const [teamPositionMap, setTeamPositionMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeTeamName = (name) => {
    return name
      .toLowerCase()
      .replace(/fc|afc|[\W_]+/g, "")
      .trim();
  };

  const fetchActualPositions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/api/standings`
      );
      const standings = response.data.standings[0].table;

      const positionMap = {};

      standings.forEach((standing, index) => {
        // Assign the position based on the index
        positionMap[standing.team.name] = index + 1; // Actual position is index + 1
      });

      setTeamPositionMap(positionMap);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data from Football Data API.");
    }
  };

  const getActualPosition = (teamName) => {
    const normalizedPredictionName = normalizeTeamName(teamName);

    for (const [apiTeamName, position] of Object.entries(teamPositionMap)) {
      const normalizedApiTeamName = normalizeTeamName(apiTeamName);

      if (normalizedApiTeamName.includes(normalizedPredictionName)) {
        return position;
      }
    }

    return "N/A";
  };

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_DEV}/api/prediction/${user}`
        );
        setPrediction(response.data.data);
      } catch (err) {
        setError("Error fetching prediction.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
    fetchActualPositions();
  }, [user]);

  const getArrow = (predicted, actual) => {
    if (predicted < actual) {
      return <span style={{ color: "green" }}>⬆️</span>; // Green for better performance
    } else if (predicted > actual) {
      return <span style={{ color: "red" }}>🔻</span>;
    } else {
      return <span style={{ color: "green" }}>✅</span>; // Green check for correct prediction
    }
  };

  const calculatePredictionStats = () => {
    let correctCount = 0;
    let oneOffCount = 0;
    let twoOffCount = 0;
    let furthestDiff = 0;
    let furthestTeam = "";

    prediction.teams.forEach((team, index) => {
      const actualPosition = getActualPosition(team.name);
      const predictedPosition = index + 1;
      const diff =
        actualPosition !== "N/A"
          ? Math.abs(predictedPosition - actualPosition)
          : null;

      if (diff === 0) {
        correctCount++;
      } else if (diff === 1) {
        oneOffCount++;
      } else if (diff === 2) {
        twoOffCount++;
      }

      if (diff !== null && diff > furthestDiff) {
        furthestDiff = diff;
        furthestTeam = team.name;
      }
    });

    return {
      correctCount,
      oneOffCount,
      twoOffCount,
      furthestTeam,
      furthestDiff,
    };
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const stats = calculatePredictionStats();

  return (
    <div className="app-container">
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
          <div className="prediction-container">
            <table className="prediction-table">
              <thead>
                <tr>
                  <th>Predicted Position</th>
                  <th>Team</th>
                  <th>Actual Position</th>
                  <th>Diff</th>
                </tr>
              </thead>
              <tbody>
                {prediction.teams.map((team, index) => {
                  const actualPosition = getActualPosition(team.name);
                  const predictedPosition = index + 1;
                  const positionDiff =
                    actualPosition !== "N/A"
                      ? actualPosition - predictedPosition
                      : "N/A";

                  return (
                    <tr key={index}>
                      <td>{predictedPosition}</td>
                      <td>
                        <img
                          src={team.logo}
                          alt={`${team.name} logo`}
                          width="40"
                        />{" "}
                        {team.name}
                      </td>
                      <td>{actualPosition}</td>
                      <td>
                        {getArrow(predictedPosition, actualPosition)}
                        {positionDiff !== "N/A" && positionDiff !== 0
                          ? `(${
                              positionDiff > 0
                                ? `+${positionDiff}`
                                : positionDiff
                            })`
                          : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* New Stats Table */}
          </div>
        )}
        // End of Display Form
      </div>
      <table className="stats-table">
        <thead>
          <tr>
            <th>Stat</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Correct Positions</td>
            <td>{stats.correctCount}</td>
          </tr>
          <tr>
            <td>One Off</td>
            <td>{stats.oneOffCount}</td>
          </tr>
          <tr>
            <td>Two Off</td>
            <td>{stats.twoOffCount}</td>
          </tr>
          <tr>
            <td>Furthest Prediction</td>
            <td>
              {stats.furthestTeam} ({stats.furthestDiff})
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DisplayPrediction;
