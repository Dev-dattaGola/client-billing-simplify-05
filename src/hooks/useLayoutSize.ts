
import { useState, useEffect, useCallback, useRef } from 'react';

export function useLayoutSize() {
  // Use refs for tracking state to avoid unnecessary renders
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
  // Track initialization state with refs
  const isInitializedRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Memoized check for mobile size
  const checkMobileSize = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    
    if (mobile !== isMobile) {
      setIsMobile(mobile);
      
      // Only auto-collapse sidebar on mobile if already initialized
      if (mobile && isInitializedRef.current) {
        setIsSidebarOpen(false);
      }
    }
    
    // Mark as initialized after first check
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      // Initial mobile state - collapse sidebar on mobile
      if (mobile) {
        setIsSidebarOpen(false);
      }
    }
  }, [isMobile]);
  
  // Initialize on mount with debounced resize
  useEffect(() => {
    // Initial check
    checkMobileSize();
    
    // Debounced resize handler
    const handleResize = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        checkMobileSize();
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [checkMobileSize]);
  
  // Memoized toggle function
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);
  
  return {
    isMobile,
    isSidebarOpen,
    toggleSidebar
  };
}
