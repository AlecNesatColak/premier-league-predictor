import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css"; // Import the CSS for the navbar

const Navbar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // New state for hamburger menu

  // Toggle the hamburger menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isAuthenticated = !!localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUserData(null);
    alert("You have been logged out.");
    navigate("/login");
    setIsOpen(false); // Close the menu on logout
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      const currentPath = window.location.pathname;

      // Allow navigation to /register and /login pages without token
      if (currentPath === "/register" || currentPath === "/login") {
        return; // Skip token validation for these pages
      }

      // For all other pages, check for token
      if (!token) {
        alert("User not authenticated");
        navigate("/login");
        throw new Error("No token found in localStorage");
      }

      // Fetch user data if token exists
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_PROD}/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("User data:", response.data);
        setUserData(response.data);
      } catch (error) {
        navigate("/login");
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, navigate]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Hamburger icon for mobile */}
        <div className="hamburger" onClick={toggleMenu}>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
        </div>

        {/* Navbar links */}
        <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/prediction-form" onClick={() => setIsOpen(false)}>Prediction Form</Link>
          </li>
          {userData && (
            <li>
              <Link to={`/prediction/${userData.username}`} onClick={() => setIsOpen(false)}>
                Display Prediction
              </Link>
            </li>
          )}
          <li>
            <Link to="/matchday-selector" onClick={() => setIsOpen(false)}>MatchWeeks</Link>
          </li>

          {isAuthenticated ? (
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
              </li>
              <li>
                <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
