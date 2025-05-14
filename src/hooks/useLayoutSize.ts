
import { useState, useEffect, useCallback, useMemo } from 'react';

export const useLayoutSize = () => {
  // Use function for initial state to prevent unnecessary recalculations
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  
  // Use useCallback to memoize this function
  const checkIfMobile = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
    
    // Only auto-collapse on mobile if the sidebar was actually open and we're transitioning to mobile
    if (mobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [isSidebarOpen]);
  
  useEffect(() => {
    // Use proper debouncing for resize events
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    
    const handleResize = () => {
      if (resizeTimer !== null) {
        clearTimeout(resizeTimer);
      }
      // Using a debounced timeout for better performance
      resizeTimer = setTimeout(() => {
        checkIfMobile();
      }, 250);
    };
    
    // Initial check
    checkIfMobile();
    
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on unmount
    return () => {
      if (resizeTimer !== null) {
        clearTimeout(resizeTimer);
      }
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

export default useLayoutSize;
