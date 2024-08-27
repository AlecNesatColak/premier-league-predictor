import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./MatchdaySelections.css"; // Import CSS for styling

const MatchdaySelections = () => {
  const { matchdayNumber, user } = useParams(); // Extract matchdayNumber and user from the URL
  const [matches, setMatches] = useState([]);
  const [userPredictions, setUserPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false); // Control showing user predictions

  useEffect(() => {
    // Fetch matchday schedule
    const fetchMatches = async () => {
      try {
        const response = await fetch(
          `https://premier-league-predictor-1.onrender.com/api/matchweek?matchday=${matchdayNumber}`
        );
        const data = await response.json();
        setMatches(data.matches);
      } catch (error) {
        console.error("Error fetching matchweek data:", error);
      }
    };

    // Fetch user predictions
    const fetchUserPredictions = async () => {
      try {
        const response = await fetch(
          `https://premier-league-predictor-1.onrender.com/api/user-predictions?user=${user}&matchday=${matchdayNumber}`
        );
        const data = await response.json();
        setUserPredictions(data.predictions);
      } catch (error) {
        console.error("Error fetching user predictions:", error);
      }
    };

    fetchMatches();
    fetchUserPredictions();
  }, [matchdayNumber, user]);

  const handleShowPredictions = () => {
    setShowPredictions(true);
  };

  return (
    <div className="matchday-selections-container">
      <div className="match-schedule">
        <h1>Matchweek {matchdayNumber} Schedule</h1>
        {matches.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Home Team</th>
                <th>Away Team</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.id}>
                  <td>{match.homeTeam.name}</td>
                  <td>{match.awayTeam.name}</td>
                  <td>
                    {match.score.fullTime.home} - {match.score.fullTime.away}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading matchday schedule...</p>
        )}
      </div>

      {showPredictions && (
        <div className="user-predictions">
          <h2>{user}'s Predictions for Matchweek {matchdayNumber}</h2>
          {userPredictions.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Home Team</th>
                  <th>Away Team</th>
                  <th>Predicted Score</th>
                </tr>
              </thead>
              <tbody>
                {userPredictions.map((prediction) => (
                  <tr key={prediction.id}>
                    <td>{prediction.homeTeam.name}</td>
                    <td>{prediction.awayTeam.name}</td>
                    <td>
                      {prediction.homeScore} - {prediction.awayScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No predictions found for this matchday.</p>
          )}
        </div>
      )}

      {!showPredictions && (
        <button onClick={handleShowPredictions}>
          Show Your Selections
        </button>
      )}
    </div>
  );
};

export default MatchdaySelections;
