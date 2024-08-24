import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ReactDOM from "react-dom";
import axios from "axios";
import "./PredictionForm.css";
import { useNavigate } from "react-router-dom";

// Helper to render Draggable item into a portal
const usePortal = () => {
  const [portal] = useState(() => document.createElement("div"));

  React.useEffect(() => {
    document.body.appendChild(portal);
    return () => {
      document.body.removeChild(portal);
    };
  }, [portal]);

  return portal;
};

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
  const navigate = useNavigate();

  const portal = usePortal();

  const reorderTeams = (sourceIndex, destinationIndex) => {
    const reorderedTeams = [...teams];
    const [removed] = reorderedTeams.splice(sourceIndex, 1);
    reorderedTeams.splice(destinationIndex, 0, removed);
    setTeams(reorderedTeams);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    reorderTeams(result.source.index, result.destination.index);
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: 10,
    margin: `5px 5px 8px 5px`,
    background: isDragging ? "lightgreen" : "#fff",
    borderRadius: "5px",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    ...draggableStyle,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user === "" || teams.length === 0) {
      alert("Please fill out your name and reorder the teams");
      return;
    }

    try {
      await axios.post(
        "https://premier-league-predictor-1.onrender.com/api/prediction",
        {
          user,
          teams,
        }
      );
      alert("Prediction submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting prediction:", error);
      alert("There was an issue submitting your prediction. Please try again.");
    }
  };

  const DraggableItem = ({ provided, snapshot, children }) => {
    if (!snapshot.isDragging) {
      return (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          {children}
        </div>
      );
    }

    return ReactDOM.createPortal(
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
      >
        {children}
      </div>,
      portal
    );
  };

  return (
    <div className="app-container">
      <div className="left-side"></div>
      <div className="right-side"></div>
      <div className="form-content" onSubmit={handleSubmit}>
        <h1 className="text">Premier League Prediction Form</h1>
        <form className="prediction-form">
          <div className="table-container">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="teams-column-1">
                {(provided) => (
                  <div
                    className="team-column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {teams.slice(0, 10).map((team, index) => (
                      <Draggable
                        key={team.name}
                        draggableId={`${team.name}-${index}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <DraggableItem
                            provided={provided}
                            snapshot={snapshot}
                          >
                            <img
                              src={team.logo}
                              alt={`${team.name} logo`}
                              width="40"
                              style={{ marginRight: "10px" }}
                            />
                            {team.name}
                          </DraggableItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <Droppable droppableId="teams-column-2">
                {(provided) => (
                  <div
                    className="team-column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {teams.slice(10, 20).map((team, index) => (
                      <Draggable
                        key={team.name}
                        draggableId={`${team.name}-${index + 10}`}
                        index={index + 10}
                      >
                        {(provided, snapshot) => (
                          <DraggableItem
                            provided={provided}
                            snapshot={snapshot}
                          >
                            <img
                              src={team.logo}
                              alt={`${team.name} logo`}
                              width="40"
                              style={{ marginRight: "10px" }}
                            />
                            {team.name}
                          </DraggableItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <input
            type="text"
            placeholder="Enter your name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            className="name-input"
          />
          <button type="submit">Submit Prediction</button>
        </form>
      </div>
    </div>
  );
};

export default PredictionForm;
