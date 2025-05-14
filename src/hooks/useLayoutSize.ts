
import { useState, useEffect, useCallback, useRef } from 'react';

export function useLayoutSize() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const initialCheckDone = useRef(false);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use useCallback to memoize the checkIfMobile function
  const checkIfMobile = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    
    // Only update the state if the value has changed to prevent unnecessary re-renders
    if (isMobile !== mobile) {
      setIsMobile(mobile);
      
      // Auto-collapse sidebar only when switching to mobile from desktop
      // AND only if we haven't done the initial check yet or sidebar is open
      if (mobile && (isSidebarOpen || !initialCheckDone.current)) {
        setIsSidebarOpen(false);
      }
    }
    
    // Mark initial check as done
    if (!initialCheckDone.current) {
      initialCheckDone.current = true;
    }
  }, [isMobile, isSidebarOpen]);
  
  // Initial check - only run once
  useEffect(() => {
    // Only run if not done yet
    if (!initialCheckDone.current) {
      // Small delay to ensure window size is available
      const timer = setTimeout(() => {
        checkIfMobile();
      }, 10);
      
      return () => clearTimeout(timer);
    }
  }, [checkIfMobile]);
  
  // Handle window resize events with debounce
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      
      resizeTimerRef.current = setTimeout(() => {
        checkIfMobile();
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [checkIfMobile]); // Only re-run if checkIfMobile changes

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
