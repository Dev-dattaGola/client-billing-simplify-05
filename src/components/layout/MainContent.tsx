
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
      <main className="flex-1 bg-gray-50 overflow-y-auto p-4">
        {loginContent}
      </main>
    );
  }

  return (
    <main 
      className={`flex-1 bg-gray-50 overflow-y-auto p-4 transition-all duration-300 ${sidebarAdjustmentClass}`}
    >
      {children}
    </main>
  );
};

export default React.memo(MainContent);
