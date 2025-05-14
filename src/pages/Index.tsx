
import React from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Use a simple redirect instead of any state changes that might trigger re-renders
  return <Navigate to="/dashboard" replace />;
};

export default Index;
