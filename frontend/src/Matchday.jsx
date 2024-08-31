import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Matchday.css"; // Import your CSS file

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

const PredictScores = ({ matches }) => {
  return (
    <div className="prediction-form-container">
      <form>
        <table>
          <thead>
            <tr>
              <th>Home Score</th>
              <th>Away Score</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id}>
                <td>
                  <input type="number" name="homeScore" />
                </td>
                <td>
                  <input type="number" name="awayScore" />
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

const Matchday = () => {
  const { matchdayNumber } = useParams(); // Get matchday number from URL
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setMatches(data.matches);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching matchweek data:", error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, [matchdayNumber]); // Refetch when matchdayNumber changes

  // Handle navigation to the next matchday
  const handleNextMatchday = () => {
    const nextMatchday = parseInt(matchdayNumber) + 1;
    if (nextMatchday <= 38) {
      navigate(`/matchday/${nextMatchday}`); // Navigate to next matchday
    }
  };

  // Handle showing the user's predictions
  const handleShowPredictions = () => {
    const user = "username"; // Replace with actual username logic
    navigate(`/matchday/${matchdayNumber}/${user}`); // Navigate to matchday predictions page
  };

  return (
    <div className="App">
      <h1 className="matchday-h1">Premier League Matchday {matchdayNumber}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : matches.length > 0 ? (
        <div className="tables-container">
          <Matchweek matches={matches} />
          <PredictScores matches={matches} />
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
