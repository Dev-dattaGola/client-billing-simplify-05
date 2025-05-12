
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface MainContentProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ children, isSidebarOpen, isMobile }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Debug for authentication issues
  console.log("MainContent: Auth state =", isAuthenticated);

  if (!isAuthenticated) {
    return (
      <main className="flex-1 bg-gray-50 overflow-y-auto p-4">
        <div className="h-full flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to LYZ Law Firm</h1>
          <p className="text-gray-600 text-center max-w-md">
            Please log in to access the dashboard
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/login')}
              className="bg-lawfirm-light-blue hover:bg-lawfirm-light-blue/90"
            >
              Login
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main 
      className={`flex-1 bg-gray-50 overflow-y-auto p-4 transition-all duration-300 ${
        isSidebarOpen && !isMobile ? 'ml-0' : 'ml-0'
      }`}
    >
      {children}
    </main>
  );
};

export default MainContent;
