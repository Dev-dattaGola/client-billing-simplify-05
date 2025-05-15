
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ToastType } from '@/types/toast';

// Define the context type
export interface ToastContextType {
  toasts: ToastType[];
  toast: (props: Omit<ToastType, "id" | "open">) => string;
  dismiss: (toastId?: string) => void;
  update: (id: string, props: Omit<ToastType, "id">) => void;
}

// Create the context with a default empty implementation
export const ToastContext = createContext<ToastContextType>({
  toasts: [],
  toast: () => "",
  dismiss: () => {},
  update: () => {},
});

// Provider component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  // Function to add a toast
  const toast = (props: Omit<ToastType, "id" | "open">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastType = { id, open: true, ...props };
    setToasts((prevToasts) => [...prevToasts, newToast]);
    return id;
  };

  // Function to dismiss a toast
  const dismiss = (toastId?: string) => {
    if (toastId) {
      setToasts((prevToasts) => 
        prevToasts.filter((toast) => toast.id !== toastId)
      );
    } else {
      setToasts([]);
    }
  };

  // Function to update a toast
  const update = (id: string, props: Omit<ToastType, "id">) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === id ? { ...toast, ...props } : toast
      )
    );
  };
  
  const contextValue: ToastContextType = {
    toasts,
    toast,
    dismiss,
    update,
  };
  
  return (
    <ToastContext.Provider value={contextValue}>
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
