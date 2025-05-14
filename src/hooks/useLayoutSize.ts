
import { useState, useEffect, useCallback, useRef } from 'react';

export function useLayoutSize() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const initialCheckDone = useRef(false);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if mobile, but avoid unnecessary state updates
  const checkIfMobile = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    
    // Only update if different to prevent re-renders
    if (isMobile !== mobile) {
      setIsMobile(mobile);
      
      // Auto-collapse sidebar only when switching to mobile from desktop
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
    if (!initialCheckDone.current) {
      const timer = setTimeout(checkIfMobile, 10);
      return () => clearTimeout(timer);
    }
  }, [checkIfMobile]);
  
  // Handle window resize with debounce
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      
      resizeTimerRef.current = setTimeout(checkIfMobile, 250);
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

  // Memoize the toggle function
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return {
    isMobile,
    isSidebarOpen,
    toggleSidebar
  };
}
