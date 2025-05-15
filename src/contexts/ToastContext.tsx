
import React, { createContext, useCallback, useState } from 'react';

// Define our own types matching what's available from use-toast
interface Toast {
  id: string;
  title?: string;
  description?: React.ReactNode;
  variant?: 'default' | 'destructive';
  action?: React.ReactNode;
}

interface ToastOptions {
  title?: string;
  description?: React.ReactNode;
  variant?: 'default' | 'destructive';
  action?: React.ReactNode;
}

interface ToastContextType {
  toast: (options: ToastOptions) => string;
  dismiss: (toastId?: string) => void;
  update: (options: ToastOptions & { id: string }) => void;
  toasts: Toast[];
}

// Create context with default values
export const ToastContext = createContext<ToastContextType>({
  toast: () => "",
  dismiss: () => {},
  update: () => {},
  toasts: []
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).slice(2, 11);
    const newToast: Toast = { id, ...options };
    
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const dismiss = useCallback((toastId?: string) => {
    setToasts((prev) => 
      toastId 
        ? prev.filter((toast) => toast.id !== toastId)
        : []
    );
  }, []);

  const update = useCallback((data: ToastOptions & { id: string }) => {
    const { id, ...options } = data;
    
    setToasts((prev) => 
      prev.map((toast) => 
        toast.id === id ? { ...toast, ...options } : toast
      )
    );
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss, update, toasts }}>
      {children}
      <Sonner />
    </ToastContext.Provider>
  );
}

// Import Sonner only once it's referenced
import { Toaster as Sonner } from 'sonner';
