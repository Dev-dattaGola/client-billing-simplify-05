
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LandingPage from "./LandingPage";

const Index = () => {
  // Remove auto-redirect logic to prevent loops
  return <LandingPage />;
};

export default Index;
