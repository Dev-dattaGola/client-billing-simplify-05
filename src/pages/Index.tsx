
import React from "react";
import { Navigate } from "react-router-dom";

// Using React.memo to prevent unnecessary re-renders and adding a stable component
const Index: React.FC = () => {
  // Simple static redirect without any state changes
  return <Navigate to="/dashboard" replace />;
};

export default React.memo(Index);
