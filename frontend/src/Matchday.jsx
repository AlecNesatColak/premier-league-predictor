import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Matchday.css"; // Import your CSS file
import axios from "axios";

// Component to display a table of matches
const Matchweek = ({ matches }) => {
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
      <table>
        <thead>
          <tr>
            <th>Home Team</th>
            <th>Away Team</th>
            <th>Score</th>
            <th>Match Status</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id}>
              <td>
                <img src={match.homeTeam.crest} alt={match.homeTeam.name} />
                {match.homeTeam.name}
              </td>
              <td>
                <img src={match.awayTeam.crest} alt={match.awayTeam.name} />
                {match.awayTeam.name}
              </td>
              <td>
                {match.score.fullTime.home} - {match.score.fullTime.away}
              </td>
              <td>
                {(match.status === "FINISHED" || match.status === "IN_PLAY")
                  ? (match.status === "IN_PLAY" ? "LIVE" : match.status)
                  : convertToEST(match.utcDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PredictScores = ({ matches, matchdayNumber }) => {
  const [predictions, setPredictions] = useState(
    matches.map((match) => ({
      matchId: match.id,
      homeTeamScore: "",
      awayTeamScore: "",
    }))
  );

  // Handle score changes and update the state
  const handleScoreChange = (matchId, field, value) => {
    setPredictions((prevPredictions) =>
      prevPredictions.map((prediction) =>
        prediction.matchId === matchId
          ? { ...prediction, [field]: value }
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
        prediction.homeTeamScore !== "" && prediction.awayTeamScore !== ""
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
                <td>{match.homeTeam.name}</td>{" "}
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
                <td>{match.awayTeam.name}</td>{" "}
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

const DisplayMatchDayPredictions = ({ predictions, matches }) => {
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
                  {prediction.homeTeamScore} - {prediction.awayTeamScore}{" "}
                  {/* User's prediction */}
                </td>
                <td>
                  {match.score.fullTime.home} - {match.score.fullTime.away}{" "}
                  {/* Actual score */}
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
  const [predictions, setPredictions] = useState(null); // Add predictions state
  const [checkingPredictions, setCheckingPredictions] = useState(false); // Loading state for checking predictions
  const navigate = useNavigate(); // Use navigate for "Next Matchday" and "Show Selections" buttons

  useEffect(() => {
    // Fetch matches for the current matchday
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL_PROD
          }/api/matchweek?matchday=${matchdayNumber}`
        );
        const data = await response.json();
        // console.log("Matchweek data:", data);
        setMatches(data.matches);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching matchweek data:", error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, [matchdayNumber]); // Refetch when matchdayNumber changes

  useEffect(() => {
    console.log("Predictions state updated:", predictions);
  }, [predictions]);

  // Handle navigation to the next matchday
  const handleNextMatchday = () => {
    const nextMatchday = parseInt(matchdayNumber) + 1;
    if (nextMatchday <= 38) {
      navigate(`/matchday/${nextMatchday}`); // Navigate to next matchday
    }
  };

  // Handle showing the user's predictions
  const handleShowPredictions = async () => {
    const user = localStorage.getItem("username");
    setCheckingPredictions(true); // Start checking predictions

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL_PROD
        }/api/check-predictions/${user}/${matchdayNumber}`
      );

      const data = response.data;
      console.log("Response data:", data);

      if (data.exists) {
        // User has already submitted predictions, update the state with the predictions array
        setPredictions(data.data.predictions); // Correctly access the predictions array
      } else {
        // No predictions, clear the predictions state to show the form
        setPredictions(null);
      }
    } catch (err) {
      console.error("Error fetching user matchday predictions data:", err);
    } finally {
      setCheckingPredictions(false); // Done checking predictions
    }
  };

  // Conditionally render predictions or form based on existence of predictions
  return (
    <div className="App">
      <h1 className="matchday-h1">Premier League Matchday {matchdayNumber}</h1>

      {loading ? (
        <p>Loading matches...</p>
      ) : matches.length > 0 ? (
        <div className="tables-container">
          <Matchweek matches={matches} />

          {/* Show either the form or the predictions */}
          {checkingPredictions ? (
            <p>Checking predictions...</p>
          ) : predictions ? (
            <DisplayMatchDayPredictions
              predictions={predictions}
              matches={matches}
            />
          ) : (
            <PredictScores matches={matches} matchdayNumber={matchdayNumber} />
          )}
        </div>
      ) : (
        <p>No matches found for matchday {matchdayNumber}</p>
      )}

      <div className="button-container">
        <button className="matchday-button" onClick={handleNextMatchday}>
          Next Matchday
        </button>
        <button className="matchday-button" onClick={handleShowPredictions}>
          Show Your Selections
        </button>
      </div>
    </div>
  );
};

export default Matchday;
