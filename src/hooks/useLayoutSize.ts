
import { useState, useEffect, useCallback, useRef } from 'react';

export function useLayoutSize() {
  // Use state only for what needs to trigger re-renders
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(window.innerWidth >= 1024);
  
  // Use refs for tracking state that shouldn't trigger re-renders
  const initializedRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<number | null>(null);
  
  // Memoized function to check for mobile size
  const checkMobileSize = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    
    // Only update state if there's an actual change
    if (mobile !== isMobile) {
      setIsMobile(mobile);
      
      // Only auto-close sidebar on mobile if already initialized
      if (mobile && initializedRef.current) {
        setIsSidebarOpen(false);
      } else if (!mobile && initializedRef.current) {
        setIsSidebarOpen(true);
      }
    }
  }, [isMobile]);
  
  // Set up resize listener with proper cleanup
  useEffect(() => {
    // Mark as initialized after first render
    initializedRef.current = true;
    
    // Run initial check
    checkMobileSize();
    
    // Set up debounced resize handler
    const handleResize = () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = window.setTimeout(() => {
        checkMobileSize();
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [checkMobileSize]);
  
  // Memoize toggle function
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);
  
  return {
    isMobile,
    isSidebarOpen, 
    toggleSidebar
  };
}
