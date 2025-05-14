
import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

// Used memo to prevent unnecessary re-renders
const MainContent = memo<MainContentProps>(({ children, isSidebarOpen, isMobile }) => {
  // Avoid complex calculations in the render function
  const contentClassName = cn(
    "flex-1 bg-gray-50 overflow-y-auto transition-all duration-300",
    isMobile ? "w-full" : (isSidebarOpen ? "ml-60" : "ml-0")
  );

  return (
    <main className={contentClassName}>
      {children}
    </main>
  );
});

MainContent.displayName = "MainContent";

export default MainContent;
