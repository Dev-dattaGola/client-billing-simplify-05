
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen flex flex-col dark">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 mt-16 h-[calc(100vh-4rem)]">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
        <MainContent isSidebarOpen={!isSidebarCollapsed} isMobile={isMobile}>
          {children}
        </MainContent>
      </div>
    </div>
  );
};

export default React.memo(PageLayout);
