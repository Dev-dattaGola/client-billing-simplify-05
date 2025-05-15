
import React, { createContext, useContext } from 'react';
import { ToastActionElement, ToastProps } from '@/components/ui/toast';

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

interface ToastContextType {
  toast: (props: Omit<ToasterToast, "id">) => void;
  dismiss: (toastId?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // This is a simplified implementation just to fix the context error
  // In a real implementation, this would manage the toast state
  
  const toast = (props: Omit<ToasterToast, "id">) => {
    // This function would normally add a toast to state
    console.log('Toast triggered:', props);
  };
  
  const dismiss = (toastId?: string) => {
    // This function would normally remove a toast from state
    console.log('Toast dismissed:', toastId);
  };
  
  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};
