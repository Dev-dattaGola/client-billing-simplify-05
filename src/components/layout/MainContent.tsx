
import React, { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

// Used memo to prevent unnecessary re-renders
const MainContent = memo<MainContentProps>(({ children, isSidebarOpen, isMobile }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Using useMemo for stable class name that doesn't change on each render
  const contentClassName = useMemo(() => {
    return cn(
      "flex-1 bg-gray-50 overflow-y-auto transition-all duration-300",
      isMobile ? "w-full" : (isSidebarOpen ? "ml-60" : "ml-0")
    );
  }, [isMobile, isSidebarOpen]);

  // Don't conditionally render based on authentication here, let PageLayout handle it
  return (
    <main className={contentClassName}>
      {children}
    </main>
  );
});

MainContent.displayName = "MainContent";

export default MainContent;
