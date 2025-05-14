
import { useState, useEffect, useCallback, useRef } from 'react';

export function useLayoutSize() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Use refs to track state without causing renders
  const initialCheckDoneRef = useRef(false);
  const isMountedRef = useRef(true);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memoized mobile check function
  const checkIfMobile = useCallback(() => {
    if (!isMountedRef.current) return;
    
    const mobile = window.innerWidth < 1024;
    
    // Only update state if the value has actually changed
    if (mobile !== isMobile) {
      setIsMobile(mobile);
      
      // Auto-collapse sidebar when switching to mobile
      // But only if we're not in the initial setup
      if (mobile && initialCheckDoneRef.current) {
        setIsSidebarOpen(false);
      }
    }
    
    // Mark initial check as done
    if (!initialCheckDoneRef.current) {
      initialCheckDoneRef.current = true;
      
      // Initial mobile check - set sidebar state only once
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    }
  }, [isMobile, isSidebarOpen]);
  
  // Initial check with slight delay to ensure DOM is ready
  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
    // Delay initial check slightly
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        checkIfMobile();
      }
    }, 50);
    
    // Cleanup
    return () => {
      clearTimeout(timer);
      isMountedRef.current = false;
    };
  }, [checkIfMobile]);
  
  // Handle window resize with debounce
  useEffect(() => {
    const handleResize = () => {
      // Clear any pending timer
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      
      // Set new timer
      resizeTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          checkIfMobile();
        }
        resizeTimerRef.current = null;
      }, 250); // 250ms debounce
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [checkIfMobile]);

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
