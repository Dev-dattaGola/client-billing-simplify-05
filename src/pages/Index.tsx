
import React from "react";
import { Navigate } from "react-router-dom";

// Using React.memo to prevent unnecessary re-renders
const Index: React.FC = React.memo(() => {
  // Use a simple redirect without any state changes or hooks
  return <Navigate to="/dashboard" replace />;
});

Index.displayName = "Index";

export default Index;
