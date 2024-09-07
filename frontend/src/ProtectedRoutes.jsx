import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component }) => {
  const token = localStorage.getItem("authToken");

  // Check if the token exists
  const isAuthenticated = token ? true : false;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return <Component />;
};

export default ProtectedRoute;
