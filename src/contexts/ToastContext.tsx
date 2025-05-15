
import React, { createContext, useCallback, useState } from 'react';
import type { Toast, ToastContextType, ToastOptions } from '@/hooks/use-toast';
import { Toaster as Sonner } from 'sonner';

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
