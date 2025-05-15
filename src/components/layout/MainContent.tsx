
import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  children,
  isSidebarOpen,
  isMobile,
}) => {
  return (
    <main
      className={`flex-1 overflow-y-auto transition-all duration-300 ${
        isSidebarOpen && !isMobile ? 'ml-56' : 'ml-14'
      } mt-16`}
    >
      {children}
    </main>
  );
};

export default MainContent;
