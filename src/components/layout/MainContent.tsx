
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface MainContentProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

// Memoize the component to prevent unnecessary re-renders
const MainContent = React.memo<MainContentProps>(({ children, isSidebarOpen, isMobile }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="h-full flex flex-col items-center justify-center gap-4 p-4">
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

  // Pre-calculate the className to avoid inline string concatenation during render
  const className = `flex-1 bg-gray-50 overflow-y-auto transition-all duration-300 ${
    isSidebarOpen && !isMobile ? 'ml-60' : 'ml-0'
  }`;

  return (
    <main className={className}>
      {children}
    </main>
  );
});

// Add display name for debugging
MainContent.displayName = "MainContent";

export default MainContent;
