
import { useState, useEffect, useCallback, useRef } from 'react';

export function useLayoutSize() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const initialCheckDone = useRef(false);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  // Memoized mobile check function to prevent unnecessary renders
  const checkIfMobile = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    
    // Only update if different to prevent re-renders
    if (mobile !== isMobile && isMountedRef.current) {
      setIsMobile(mobile);
      
      // Auto-collapse sidebar only when switching to mobile from desktop
      // and only if initial check hasn't been done or sidebar is open
      if (mobile && (isSidebarOpen || !initialCheckDone.current)) {
        setIsSidebarOpen(false);
      }
    }
    
    // Mark initial check as done
    if (!initialCheckDone.current) {
      initialCheckDone.current = true;
    }
  }, [isMobile, isSidebarOpen]);
  
  // Initial check - run once after mount with a small delay
  useEffect(() => {
    // Set up mounted ref
    isMountedRef.current = true;
    
    // Only run this once
    if (!initialCheckDone.current) {
      const timer = setTimeout(checkIfMobile, 10);
      return () => {
        clearTimeout(timer);
        isMountedRef.current = false;
      };
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, [checkIfMobile]);
  
  // Handle window resize with debounce
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      
      resizeTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          checkIfMobile();
        }
        resizeTimerRef.current = null;
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      window.removeEventListener('resize', handleResize);
      isMountedRef.current = false;
    };
  }, [checkIfMobile]);

  // Memoize toggle function with stable reference
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return {
    isMobile,
    isSidebarOpen,
    toggleSidebar
  };
}
