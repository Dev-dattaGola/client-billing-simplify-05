
import { useState, useEffect, useCallback, useRef } from 'react';

export function useLayoutSize() {
  // Use state for only what needs to trigger re-renders
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
  // Use refs for tracking state that shouldn't trigger re-renders
  const isInitializedRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Memoized function to check for mobile size
  const checkMobileSize = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    
    // Only update state if there's an actual change
    if (mobile !== isMobile) {
      setIsMobile(mobile);
      
      // Only auto-close sidebar on mobile if already initialized
      if (mobile && isInitializedRef.current) {
        setIsSidebarOpen(false);
      }
    }
    
    // Mark as initialized after first check
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      // Initialize sidebar state based on screen size
      if (mobile) {
        setIsSidebarOpen(false);
      }
    }
  }, [isMobile]);
  
  // Set up resize listener with proper cleanup
  useEffect(() => {
    // Run initial check
    checkMobileSize();
    
    // Set up debounced resize handler
    const handleResize = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        checkMobileSize();
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [checkMobileSize]);
  
  // Memoize toggle function to prevent recreation on each render
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);
  
  return {
    isMobile,
    isSidebarOpen, 
    toggleSidebar
  };
}
