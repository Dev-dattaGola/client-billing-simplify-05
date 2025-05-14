
import { useState, useEffect, useCallback } from 'react';

export const useLayoutSize = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Initialize based on screen size to prevent flashing
    return window.innerWidth >= 1024;
  });
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  
  const checkIfMobile = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
    
    // Only auto-collapse on mobile
    if (mobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [isSidebarOpen]);
  
  useEffect(() => {
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up event listener on unmount
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [checkIfMobile]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return {
    isSidebarOpen,
    isMobile,
    setIsSidebarOpen,
    toggleSidebar
  };
};
