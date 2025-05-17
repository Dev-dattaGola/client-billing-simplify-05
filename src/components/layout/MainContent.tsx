
import React, { useMemo } from 'react';
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

  // Memoize the login content to prevent unnecessary re-renders
  const loginContent = useMemo(() => {
    if (!isAuthenticated) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-gradient">Welcome to LAWerp500</h1>
          <p className="text-gray-300 text-center max-w-md">
            Please log in to access the dashboard
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/login')}
              className="button-glass"
            >
              Login
            </Button>
          </div>
        </div>
      );
    }
    return null;
  }, [isAuthenticated, navigate]);

  // Determine the sidebar adjustment class only when dependencies change
  const sidebarAdjustmentClass = useMemo(() => {
    return isSidebarOpen && !isMobile ? 'ml-60' : 'ml-0';
  }, [isSidebarOpen, isMobile]);

  if (!isAuthenticated) {
    return (
      <main className="flex-1 overflow-y-auto text-white">
        {loginContent}
      </main>
    );
  }

  return (
    <main 
      className={`flex-1 overflow-y-auto transition-all duration-300 text-white ${sidebarAdjustmentClass}`}
    >
      {children}
    </main>
  );
};

export default React.memo(MainContent);
