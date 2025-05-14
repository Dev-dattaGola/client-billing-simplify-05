
import React from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Directly redirect to dashboard instead of rendering LandingPage
  return <Navigate to="/dashboard" replace />;
};

export default Index;
