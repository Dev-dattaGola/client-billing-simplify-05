
import { useAuth } from "@/contexts/AuthContext";
import LandingPage from "./LandingPage";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // Show the landing page without any auto-redirection logic
  return <LandingPage />;
};

export default Index;
