
import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

// Used memo to prevent unnecessary re-renders
const MainContent = memo<MainContentProps>(({ children, isSidebarOpen, isMobile }) => {
  // Wrap the children in a container to better control the rendering
  return (
    <main 
      className={cn(
        "flex-1 p-4 transition-all duration-300 overflow-y-auto bg-background",
        isMobile ? "w-full" : (isSidebarOpen ? "ml-60" : "ml-16")
      )}
    >
      {children}
    </main>
  );
});

MainContent.displayName = "MainContent";

export default MainContent;
