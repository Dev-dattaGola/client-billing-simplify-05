
import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { useAuth } from '@/contexts/AuthContext';
import { useLayoutSize } from '@/hooks/useLayoutSize';
import { Button } from "@/components/ui/button";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = React.memo<PageLayoutProps>(({ children }) => {
  const { isSidebarOpen, isMobile, toggleSidebar } = useLayoutSize();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Memoize login button handler
  const handleLoginClick = useCallback(() => {
    navigate('/login');
  }, [navigate]);
  
  // Memoize login content
  const loginContent = useMemo(() => (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Welcome to LYZ Law Firm</h1>
      <p className="text-gray-600 mb-6 text-center">Please log in to access this page.</p>
      <div className="flex justify-center">
        <Button onClick={handleLoginClick} className="bg-lawfirm-light-blue hover:bg-lawfirm-light-blue/90">
          Login
        </Button>
      </div>
    </div>
  ), [handleLoginClick]);
  
  // Determine content based on authentication status
  // Compute values once to avoid recalculation on re-renders
  const showSidebar = isAuthenticated;
  const displayContent = isAuthenticated ? children : loginContent;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 mt-16 h-[calc(100vh-4rem)]">
        {showSidebar && (
          <Sidebar 
            isCollapsed={!isSidebarOpen} 
            setIsCollapsed={toggleSidebar}
          />
        )}
        <MainContent 
          isSidebarOpen={showSidebar ? isSidebarOpen : false} 
          isMobile={isMobile}
        >
          {displayContent}
        </MainContent>
      </div>
    </div>
  );
});

// Add display name
PageLayout.displayName = "PageLayout";

export default PageLayout;
