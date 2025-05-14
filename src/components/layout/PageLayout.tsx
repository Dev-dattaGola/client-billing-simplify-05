
import React, { useCallback, memo } from 'react';
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

// Used memo to prevent unnecessary re-renders
const PageLayout: React.FC<PageLayoutProps> = memo(({ children }) => {
  const { isSidebarOpen, isMobile, toggleSidebar } = useLayoutSize();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Memoize toggle handler to prevent re-renders
  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  // Prepare the content based on authentication status
  const content = !isAuthenticated ? (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Welcome to LYZ Law Firm</h1>
      <p className="text-gray-600 mb-6 text-center">Please log in to access this page.</p>
      <div className="flex justify-center">
        <Button 
          onClick={() => navigate('/login')}
          className="bg-lawfirm-light-blue hover:bg-lawfirm-light-blue/90"
        >
          Login
        </Button>
      </div>
    </div>
  ) : children;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={handleToggleSidebar} />
      <div className="flex flex-1 mt-16 h-[calc(100vh-4rem)]">
        <Sidebar 
          isCollapsed={!isSidebarOpen} 
          setIsCollapsed={toggleSidebar}
        />
        <MainContent isSidebarOpen={isSidebarOpen} isMobile={isMobile}>
          {content}
        </MainContent>
      </div>
    </div>
  );
});

PageLayout.displayName = "PageLayout";

export default PageLayout;
