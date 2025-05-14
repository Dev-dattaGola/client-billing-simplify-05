
import { useState, useEffect, useCallback, useRef } from 'react';

export function useLayoutSize() {
  // Store states with useState
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
  // Use refs to avoid unnecessary renders and track initialization
  const isInitializedRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<number | null>(null);
  
  // Check if device is mobile and update state accordingly
  const checkMobileSize = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    
    // Only update if value actually changed to avoid unnecessary re-renders
    setIsMobile(prevMobile => {
      if (prevMobile !== mobile) {
        // If switching to mobile and not initial setup, collapse sidebar
        if (mobile && isInitializedRef.current) {
          setIsSidebarOpen(false);
        }
        return mobile;
      }
      return prevMobile;
    });
    
    // Mark as initialized after first check
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      // Initial mobile check - auto collapse on mobile
      if (mobile) {
        setIsSidebarOpen(false);
      }
    }
  }, []);
  
  // Initial check on mount
  useEffect(() => {
    checkMobileSize();
    
    // Set up debounced resize listener
    const handleResize = () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = window.setTimeout(() => {
        checkMobileSize();
        debounceTimerRef.current = null;
      }, 250);
    };
    
    // Add listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [checkMobileSize]);
  
  // Memoized toggle function to prevent recreations
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);
  
  return {
    isMobile,
    isSidebarOpen,
    toggleSidebar
  };
}
