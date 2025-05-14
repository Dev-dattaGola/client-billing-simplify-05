
import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

// Used memo to prevent unnecessary re-renders
const MainContent = memo<MainContentProps>(({ children, isSidebarOpen, isMobile }) => {
  // Using computed class name that doesn't change on each render
  const contentClassName = cn(
    "flex-1 p-4 transition-all duration-300 overflow-y-auto bg-background",
    isMobile ? "w-full" : (isSidebarOpen ? "ml-60" : "ml-16")
  );
  
  return (
    <main className={contentClassName}>
      {children}
    </main>
  );
});

MainContent.displayName = "MainContent";

export default MainContent;
