
import React, { createContext, useContext, useState } from 'react';
import { ToastActionElement, ToastProps } from '@/components/ui/toast';

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

interface ToastContextType {
  toasts: ToasterToast[];
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
  const [toasts, setToasts] = useState<ToasterToast[]>([]);
  
  const toast = (props: Omit<ToasterToast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...props }]);
    
    // Automatically dismiss toast after 5 seconds
    setTimeout(() => {
      dismiss(id);
    }, 5000);
  };
  
  const dismiss = (toastId?: string) => {
    setToasts((prev) => 
      toastId 
        ? prev.filter((toast) => toast.id !== toastId)
        : []
    );
  };
  
  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};
