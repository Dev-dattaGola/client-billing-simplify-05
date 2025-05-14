
import { useState, useEffect, useCallback, useMemo } from 'react';

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
    
    // Add event listener for window resize with debouncing
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(checkIfMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on unmount
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [checkIfMobile]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Use memoized values to prevent unnecessary re-renders
  return useMemo(() => ({
    isSidebarOpen,
    isMobile,
    setIsSidebarOpen,
    toggleSidebar
  }), [isSidebarOpen, isMobile, toggleSidebar]);
};
