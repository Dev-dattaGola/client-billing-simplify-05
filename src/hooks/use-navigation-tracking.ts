
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface UseNavigationTrackingOptions {
  // Max entries to store in the navigation history
  maxHistoryLength?: number;
  // Whether to track query parameters
  trackQueryParams?: boolean;
  // Storage key for the navigation history
  storageKey?: string;
}

/**
 * Custom hook to track navigation history for better back/forward functionality
 */
export const useNavigationTracking = (options: UseNavigationTrackingOptions = {}) => {
  const {
    maxHistoryLength = 10,
    trackQueryParams = true,
    storageKey = 'appNavigationHistory',
  } = options;
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    try {
      // Get current path including query parameters if enabled
      const currentPath = trackQueryParams 
        ? location.pathname + location.search 
        : location.pathname;
      
      // Skip tracking for certain paths if needed
      if (['/login'].includes(location.pathname)) return;
      
      // Get existing history from session storage
      const historyJSON = sessionStorage.getItem(storageKey);
      let history: string[] = historyJSON ? JSON.parse(historyJSON) : [];
      
      // Only add to history if current path is different from last entry
      if (history.length === 0 || history[history.length - 1] !== currentPath) {
        // Add current path to history
        history.push(currentPath);
        
        // Limit history length
        if (history.length > maxHistoryLength) {
          history = history.slice(history.length - maxHistoryLength);
        }
        
        // Save updated history
        sessionStorage.setItem(storageKey, JSON.stringify(history));
      }
    } catch (error) {
      console.error('Error tracking navigation:', error);
    }
  }, [location, trackQueryParams, storageKey, maxHistoryLength]);
  
  // Function to navigate back with fallback
  const goBack = (defaultPath = '/dashboard') => {
    try {
      const historyJSON = sessionStorage.getItem(storageKey);
      const history: string[] = historyJSON ? JSON.parse(historyJSON) : [];
      
      if (history.length > 1) {
        // Remove current path
        history.pop();
        // Get previous path
        const previousPath = history.pop() || defaultPath;
        // Update history in storage
        sessionStorage.setItem(storageKey, JSON.stringify(history));
        // Navigate to previous path
        navigate(previousPath);
      } else {
        // No history, go to default path
        navigate(defaultPath);
      }
    } catch (error) {
      console.error('Error navigating back:', error);
      navigate(defaultPath);
    }
  };
  
  return { goBack };
};
