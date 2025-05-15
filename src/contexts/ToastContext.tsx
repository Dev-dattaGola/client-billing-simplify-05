
import React, { createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define the context type
type ToastContextType = ReturnType<typeof useToast>;

// Create the context with a default value
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const toast = useToast();
  
  return (
    <ToastContext.Provider value={toast}>
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
