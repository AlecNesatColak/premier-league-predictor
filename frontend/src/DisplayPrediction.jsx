import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const DisplayPrediction = () => {

  const navigate = useNavigate();

  const { user } = useParams(); // Get the user's name from the URL params
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the prediction based on the user's name
    const fetchPrediction = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5002/api/prediction/${user}`
        );
        setPrediction(response.data.data); // Store the prediction data in state
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "Error fetching data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="App">
      <h1>{user}'s Premier League Prediction</h1>
      {prediction && (
        <ul>
          {prediction.teams.map((team, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <img
                src={team.logo}
                alt={`${team.name} logo`}
                width="40"
                style={{ marginRight: "10px" }}
              />
              <span>{team.name}</span>
            </li>
          ))}
        </ul>
      )}
      <div>
        <button onClick={() => navigate("/")}>Go Back to Home</button>
        <br></br>
        <button onClick={() => navigate("/form")}>Go to Form</button>
      </div>
    </div>
  );
};

export default DisplayPrediction;
