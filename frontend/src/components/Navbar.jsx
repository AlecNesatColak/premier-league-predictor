import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css"; // Import the CSS for the navbar

const Navbar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  
  // Check if the user is logged in by checking if a token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("authToken");

  const handleLogout = () => {
    // Remove the auth token from localStorage when logging out
    localStorage.removeItem("authToken");
    setUserData(null); // Clear the user data after logout
    alert("You have been logged out.");
    navigate("/login");
  };

  useEffect(() => {
    // Fetch user data if authenticated
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
          const token = localStorage.getItem("authToken");
          const response = await axios.get("https://premier-league-predictor-1.onrender.com/me", {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token as a Bearer token
            },
          });

          setUserData(response.data); // Store the user data (e.g., username)
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to fetch user data");
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/prediction-form">Prediction Form</Link>
        </li>

        {/* Display Prediction link based on whether user data is available */}
        {userData && (
          <li>
            <Link to={`/prediction/${userData.username}`}>Display Prediction</Link>
          </li>
        )}

        <li>
          <Link to="/matchday-selector">MatchWeeks</Link>
        </li>

        {/* Conditionally render based on whether the user is authenticated */}
        {isAuthenticated ? (
          <>
            <li>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
