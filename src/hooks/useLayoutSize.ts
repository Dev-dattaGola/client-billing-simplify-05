
import { useState, useEffect, useCallback, useRef } from 'react';

export function useLayoutSize() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const initialCheckDone = useRef(false);
  const isMountedRef = useRef(true);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memoized mobile check function to prevent recreating on each render
  const checkIfMobile = useCallback(() => {
    if (!isMountedRef.current) return;
    
    const mobile = window.innerWidth < 1024;
    
    // Only update if different to prevent re-renders
    if (mobile !== isMobile) {
      setIsMobile(mobile);
      
      // Auto-collapse sidebar when switching to mobile - but only when not initial render
      if (mobile && initialCheckDone.current) {
        setIsSidebarOpen(false);
      } else if (initialCheckDone.current && !mobile && !isSidebarOpen) {
        // Don't automatically expand when switching to desktop
        // Let the user control this
      }
    }
    
    // Mark initial check as done
    if (!initialCheckDone.current) {
      initialCheckDone.current = true;
      
      // Handle initial mobile setup, but don't trigger a re-render if we don't need to
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    }
  }, [isMobile, isSidebarOpen]);
  
  // Initial check - run once after mount with a small delay
  useEffect(() => {
    isMountedRef.current = true;
    
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        checkIfMobile();
      }
    }, 10);
    
    return () => {
      clearTimeout(timer);
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
