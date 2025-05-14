
import { useState, useEffect, useCallback } from 'react';

export function useLayoutSize() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Use useCallback to memoize the checkIfMobile function
  const checkIfMobile = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    
    // Only update the state if the value has changed
    if (isMobile !== mobile) {
      setIsMobile(mobile);
      
      // Auto-collapse sidebar only when switching to mobile from desktop
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    }
  }, [isMobile, isSidebarOpen]);
  
  useEffect(() => {
    // Properly debounce the resize event
    let resizeTimer: NodeJS.Timeout | null = null;
    
    const handleResize = () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      
      resizeTimer = setTimeout(() => {
        checkIfMobile();
      }, 250);
    };
    
    // Initial check once on mount
    checkIfMobile();
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [checkIfMobile]);

  // Memoize the toggle function to prevent recreation on re-renders
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return {
    isMobile,
    isSidebarOpen,
    toggleSidebar
  };
}
