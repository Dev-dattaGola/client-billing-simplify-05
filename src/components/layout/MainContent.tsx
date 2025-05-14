
import React from 'react';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

// Using React.memo to prevent unnecessary re-renders
const MainContent = React.memo<MainContentProps>(({ children, isSidebarOpen, isMobile }) => {
  return (
    <main className={cn(
      "flex-1 bg-gray-50 overflow-y-auto transition-all duration-300",
      isMobile ? "w-full" : (isSidebarOpen ? "ml-60" : "ml-0")
    )}>
      {children}
    </main>
  );
});

// Add display name for better debugging
MainContent.displayName = "MainContent";

export default MainContent;
