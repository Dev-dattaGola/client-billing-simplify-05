
import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

// Use React.memo to prevent re-renders when props don't change
const MainContent = memo<MainContentProps>(({ children, isSidebarOpen, isMobile }) => {
  return (
    <div 
      className={cn(
        "flex-1 overflow-y-auto transition-all duration-300",
        isMobile ? "w-full" : (isSidebarOpen ? "ml-60" : "ml-16")
      )}
    >
      {children}
    </div>
  );
});

MainContent.displayName = "MainContent";

export default MainContent;
