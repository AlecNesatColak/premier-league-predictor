import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Matchday.css"; // Import your CSS file

// Component to display a table of matches
const Matchweek = ({ matches }) => {
  return (
    <div className="tables-container">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Matchday = () => {
  const { matchdayNumber } = useParams(); // Get matchday number from URL
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Use navigate for "Next Matchday" button

  useEffect(() => {
    // Fetch matches for the current matchday
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5002/api/matchweek?matchday=${matchdayNumber}`
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

  return (
    <div className="App">
      <h1>Premier League Matchday {matchdayNumber}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : matches.length > 0 ? (
        <div>
          <Matchweek matches={matches} />
          <button onClick={handleNextMatchday}>Next Matchday</button>
        </div>
      ) : (
        <p>No matches found for matchday {matchdayNumber}</p>
      )}
    </div>
  );
};

export default Matchday;
