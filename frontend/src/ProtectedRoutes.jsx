import React from "react";
import { Navigate } from "react-router-dom";

// Mock function to check if the user is logged in. Replace this with your real auth logic.
const isAuthenticated = () => {
  return localStorage.getItem("authToken");  // Assume token is stored in localStorage
};

const ProtectedRoute = ({ element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
