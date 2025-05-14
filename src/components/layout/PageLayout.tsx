
import React, { useCallback, memo } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { useAuth } from '@/contexts/AuthContext';
import { useLayoutSize } from '@/hooks/useLayoutSize';

interface PageLayoutProps {
  children: React.ReactNode;
}

// Used memo to prevent unnecessary re-renders
const PageLayout: React.FC<PageLayoutProps> = memo(({ children }) => {
  const { isSidebarOpen, isMobile, setIsSidebarOpen, toggleSidebar } = useLayoutSize();
  const { isAuthenticated } = useAuth();

  // Memoize toggle handler to prevent re-renders
  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Please log in</h1>
          <p className="text-gray-600">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={handleToggleSidebar} />
      <div className="flex flex-1 mt-16 h-[calc(100vh-4rem)]">
        <Sidebar 
          isCollapsed={!isSidebarOpen} 
          setIsCollapsed={(collapsed) => setIsSidebarOpen(!collapsed)} 
        />
        <MainContent isSidebarOpen={isSidebarOpen} isMobile={isMobile}>
          {children}
        </MainContent>
      </div>
    </div>
  );
});

PageLayout.displayName = "PageLayout";

export default PageLayout;
