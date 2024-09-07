import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Matchday.css"; // Import your CSS file
import axios from "axios";

const PredictScores = ({ matches, matchdayNumber }) => {
  const [predictions, setPredictions] = useState([]);

  // Update predictions when matches change
  useEffect(() => {
    setPredictions(
      matches.map((match) => ({
        matchId: match.id,
        homeTeamScore: "",
        awayTeamScore: "",
      }))
    );
  }, [matches]);

  // Handle score changes and update the state
  const handleScoreChange = (matchId, field, value) => {
    const numericValue = value === "" ? "" : parseInt(value, 10); // Convert to number if not empty
    setPredictions((prevPredictions) =>
      prevPredictions.map((prediction) =>
        prediction.matchId === matchId
          ? { ...prediction, [field]: numericValue }
          : prediction
      )
    );
  };

  // Submit predictions using Axios
  const submitMatchdayPredictions = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("username");
    const matchweek = matchdayNumber;

    // Ensure all predictions are filled
    const allFilled = predictions.every(
      (prediction) =>
        prediction.homeTeamScore !== "" &&
        !isNaN(prediction.homeTeamScore) &&
        prediction.awayTeamScore !== "" &&
        !isNaN(prediction.awayTeamScore)
    );

    if (!allFilled) {
      alert("Please fill in all scores.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_PROD}/matchweek-predictions`,
        {
          user: user,
          matchweek: matchweek,
          predictions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Predictions submitted successfully!");
        window.location.reload();
      } else {
        alert("Error submitting predictions.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className="prediction-form-container">
      <form onSubmit={submitMatchdayPredictions}>
        <table>
          <thead>
            <tr>
              <th>Home Team</th>
              <th>Home Score</th>
              <th>Away Team</th>
              <th>Away Score</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id}>
                <td>
                  <img src={match.homeTeam.crest} />
                  {match.homeTeam.name}
                </td>{" "}
                {/* Access a specific property of the object */}
                <td>
                  <input
                    type="number"
                    name="homeTeamScore"
                    value={
                      predictions.find((p) => p.matchId === match.id)
                        ?.homeTeamScore
                    }
                    onChange={(e) =>
                      handleScoreChange(
                        match.id,
                        "homeTeamScore",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <img src={match.awayTeam.crest} />
                  {match.awayTeam.name}
                </td>{" "}
                {/* Access a specific property of the object */}
                <td>
                  <input
                    type="number"
                    name="awayTeamScore"
                    value={
                      predictions.find((p) => p.matchId === match.id)
                        ?.awayTeamScore
                    }
                    onChange={(e) =>
                      handleScoreChange(
                        match.id,
                        "awayTeamScore",
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit">Submit Predictions</button>
      </form>
    </div>
  );
};

const DisplayMatchDayPredictions = ({
  predictions,
  matches,
  isEditing,
  setPredictions,
}) => {
  const handleScoreChange = (matchId, field, value) => {
    const numericValue = value === "" ? "" : parseInt(value, 10);
    setPredictions((prevPredictions) =>
      prevPredictions.map((prediction) =>
        prediction.matchId === matchId
          ? { ...prediction, [field]: numericValue }
          : prediction
      )
    );
  };

  const convertToEST = (utcDate) => {
    const date = new Date(utcDate); // Convert the string to a Date object
    return date.toLocaleString("en-US", {
      timeZone: "America/New_York", // Timezone for EST/EDT
      weekday: "short", // Short weekday format, e.g., "Sun"
      year: "numeric",
      month: "short", // Short month format, e.g., "Aug"
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true, // Display in 12-hour format (AM/PM)
    });
  };

  return (
    <div className="matchweek-container">
      <h2>Your Predictions</h2>
      <table>
        <thead>
          <tr>
            <th>Home Team</th>
            <th>Away Team</th>
            <th>Your Prediction</th>
            <th>Actual Score</th>
            <th>Match Status</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((prediction) => {
            // Find the corresponding match details by matchId
            const match = matches.find((m) => m.id === prediction.matchId);

            if (!match) return null; // If the match is not found, skip rendering

            return (
              <tr key={prediction.matchId}>
                <td>
                  <img src={match.homeTeam.crest} alt={match.homeTeam.name} />
                  {match.homeTeam.name}
                </td>
                <td>
                  <img src={match.awayTeam.crest} alt={match.awayTeam.name} />
                  {match.awayTeam.name}
                </td>
                <td>
                  {isEditing ? (
                    <>
                      <input
                        type="number"
                        value={prediction.homeTeamScore}
                        onChange={(e) =>
                          handleScoreChange(
                            prediction.matchId,
                            "homeTeamScore",
                            e.target.value
                          )
                        }
                      />
                      {" - "}
                      <input
                        type="number"
                        value={prediction.awayTeamScore}
                        onChange={(e) =>
                          handleScoreChange(
                            prediction.matchId,
                            "awayTeamScore",
                            e.target.value
                          )
                        }
                      />
                    </>
                  ) : (
                    `${prediction.homeTeamScore} - ${prediction.awayTeamScore}`
                  )}
                </td>
                <td>
                  {match.score.fullTime.home} - {match.score.fullTime.away}
                </td>
                <td>
                  {match.status === "FINISHED" || match.status === "IN_PLAY"
                    ? match.status === "IN_PLAY"
                      ? "LIVE"
                      : match.status
                    : convertToEST(match.utcDate)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Matchday = () => {
  const { matchdayNumber } = useParams(); // Get matchday number from URL
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState(null); // Store predictions if available
  const [checkingPredictions, setCheckingPredictions] = useState(true); // Start with checking predictions
  const [isEditing, setIsEditing] = useState(false); // Track editing mode
  const navigate = useNavigate(); // Use navigate for "Next Matchday" button

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL_PROD
          }/api/matchweek?matchday=${matchdayNumber}`
        );
        const data = await response.json();
        setMatches(data.matches);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching matchweek data:", error);
        setLoading(false);
      }
    };

    const fetchPredictions = async () => {
      const user = localStorage.getItem("username");
      setCheckingPredictions(true); // Start checking predictions

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL_PROD
          }/api/check-predictions/${user}/${matchdayNumber}`
        );
        const data = response.data;
        if (data.exists) {
          setPredictions(data.data.predictions);
        } else {
          setPredictions(null);
        }
      } catch (err) {
        console.error("Error fetching user matchday predictions data:", err);
      } finally {
        setCheckingPredictions(false); // Done checking predictions
      }
    };

    fetchMatches();
    fetchPredictions();
  }, [matchdayNumber]);

  const handleNextMatchday = () => {
    const nextMatchday = parseInt(matchdayNumber) + 1;
    if (nextMatchday <= 38) {
      navigate(`/matchday/${nextMatchday}`);
    }
  };

  const handlePreviousMatchday = () => {
    const prevMatchday = parseInt(matchdayNumber) - 1;
    if (prevMatchday <= 38) {
      navigate(`/matchday/${prevMatchday}`);
    }
  };

  const handleEditPredictions = () => {
    setIsEditing(true);
  };

  const handleDeletePredictions = async () => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("username");

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL_PROD}/delete-matchday-predictions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            user: user,
            matchweek: matchdayNumber, // send user and matchweek as query parameters
          },
        }
      );

      if (response.status === 200) {
        alert("Predictions deleted successfully!");
        window.location.reload();
      } else {
        alert("Error deleting predictions.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete predictions. Please try again.");
    }
  };

  const handleSaveEditedPredictions = async () => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("username");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL_PROD}/update-matchday-predictions`,
        {
          user: user,
          matchweek: matchdayNumber,
          predictions: predictions, // Pass the updated predictions
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Predictions updated successfully!");
        setIsEditing(false); // Exit edit mode
        window.location.reload();
      } else {
        alert("Error updating predictions.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save edited predictions. Please try again.");
    }
  };

  // Conditionally render either the prediction form or the submitted predictions
  return (
    <div className="App">
      <h1 className="matchday-h1">Premier League Matchday {matchdayNumber}</h1>

      {loading ? (
        <p>Loading matches...</p>
      ) : matches.length > 0 ? (
        <div className="tables-container">
          {checkingPredictions ? (
            <p>Checking predictions...</p>
          ) : predictions ? (
            <>
              <DisplayMatchDayPredictions
                predictions={predictions}
                matches={matches}
                isEditing={isEditing}
                setPredictions={setPredictions}
              />
              <div className="button-container">
                {isEditing ? (
                  <button
                    className="matchday-button"
                    onClick={handleSaveEditedPredictions}
                  >
                    Save Predictions
                  </button>
                ) : (
                  <button
                    className="matchday-button"
                    onClick={handleEditPredictions}
                  >
                    Edit Predictions
                  </button>
                )}
                <button
                  className="matchday-button"
                  onClick={handleDeletePredictions}
                >
                  Delete Predictions
                </button>
              </div>
            </>
          ) : (
            <PredictScores matches={matches} matchdayNumber={matchdayNumber} />
          )}
        </div>
      ) : (
        <p>No matches found for matchday {matchdayNumber}</p>
      )}

      <div className="button-container">
        <button className="matchday-button" onClick={handlePreviousMatchday}>
          Previous Matchday
        </button>
        <button className="matchday-button" onClick={handleNextMatchday}>
          Next Matchday
        </button>
      </div>
    </div>
  );
};

export default Matchday;
