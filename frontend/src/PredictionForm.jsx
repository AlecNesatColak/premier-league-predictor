import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";

// The teams array with logos
const initialTeams = [
  {
    name: "Arsenal",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t3.png",
  },
  {
    name: "Aston Villa",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t7.png",
  },
  {
    name: "Bournemouth",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t91.png",
  },
  {
    name: "Brentford",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t94.png",
  },
  {
    name: "Brighton",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t36.png",
  },
  {
    name: "Chelsea",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t8.png",
  },
  {
    name: "Crystal Palace",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t31.png",
  },
  {
    name: "Everton",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t11.png",
  },
  {
    name: "Fulham",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t54.png",
  },
  {
    name: "Ipswich Town",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t40.png",
  },
  {
    name: "Leicester City",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t13.png",
  },
  {
    name: "Liverpool",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t14.png",
  },
  {
    name: "Manchester City",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t43.png",
  },
  {
    name: "Manchester United",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t1.png",
  },
  {
    name: "Newcastle United",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t4.png",
  },
  {
    name: "Nottingham Forest",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t17.png",
  },
  {
    name: "Southampton",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t20.png",
  },
  {
    name: "Tottenham Hotspur",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t6.png",
  },
  {
    name: "West Ham United",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t21.png",
  },
  {
    name: "Wolverhampton Wanderers",
    logo: "https://resources.premierleague.com/premierleague/badges/50/t39.png",
  },
];

const PredictionForm = () => {
  const [teams, setTeams] = useState(initialTeams);
  const [user, setUser] = useState("");

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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTeams = [...teams];
    const [removed] = reorderedTeams.splice(result.source.index, 1);
    reorderedTeams.splice(result.destination.index, 0, removed);

    setTeams(reorderedTeams);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user === "" || teams.length === 0) {
      alert("Please fill out your name and reorder the teams");
      return;
    }

    try {
      await axios.post("http://localhost:5002/api/prediction", {
        user,
        teams,
      });
      alert("Prediction submitted successfully!");
    } catch (error) {
      console.error("Error submitting prediction:", error);
      alert("There was an issue submitting your prediction. Please try again.");
    }
  };

  return (
    <div className="App">
      <h1>Premier League Prediction Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Enter your name"
        />
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="teams">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {teams.map((team, index) => (
                  <Draggable
                    key={team.name}
                    draggableId={`${team.name}-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <img
                          src={team.logo}
                          alt={`${team.name} logo`}
                          width="40"
                          style={{ marginRight: "10px" }}
                        />
                        {team.name}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <button type="submit">Submit Prediction</button>
      </form>
    </div>
  );
};

export default PredictionForm;