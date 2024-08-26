import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoutes";
import Home from "./Home";
import PredictionForm from "./PredictionForm";
import MatchdaySelector from "./MatchdaySelector";
import Matchday from "./Matchday";
import MatchdaySelections from "./MatchdaySelections";
import DisplayPrediction from "./DisplayPrediction";

function AppContent() {
  const location = useLocation();
  
  // Debugging path
  //console.log("Current Path:", location.pathname);

  // Manually check for exact path
  const shouldHideNavbar = location.pathname === "/login" || location.pathname === "/register";

  //console.log("Should hide navbar:", shouldHideNavbar); // Debugging log for condition

  return (
    <>
      {/* Conditionally hide the Navbar on login or register pages */}
      {!shouldHideNavbar && <Navbar />} {/* Navbar will be hidden if shouldHideNavbar is true */}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/prediction-form" element={<ProtectedRoute element={<PredictionForm />} />} />
        <Route path="/matchday-selector" element={<ProtectedRoute element={<MatchdaySelector />} />} />
        <Route path="/matchday/:matchdayNumber" element={<ProtectedRoute element={<Matchday />} />} />
        <Route path="/matchday" element={<ProtectedRoute element={<Matchday />} />} />
        <Route path="matchday/:matchdayNumber?user=username" element={<ProtectedRoute element={<MatchdaySelections />} />} />
        <Route path="/prediction/:user" element={<ProtectedRoute element={<DisplayPrediction />} />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
