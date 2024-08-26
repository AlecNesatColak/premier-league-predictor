import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS for the navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/prediction-form">Prediction Form</Link>
        </li>
        <li>
          <Link to="/display-prediction">Display Prediction</Link>
        </li>
        <li>
          <Link to="/matchday-selector">MatchWeeks</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
