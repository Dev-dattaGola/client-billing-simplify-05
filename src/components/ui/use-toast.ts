
import { useState } from "react";

// Define Toast Type
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

interface ToastContext {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => string;
  dismiss: (toastId: string) => void;
}

// Create a local cache for toasts
let toasts: Toast[] = [];

// Action to add a toast
export const addToast = (toast: Omit<Toast, "id">) => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast = { id, ...toast };
  toasts = [...toasts, newToast];

  // Auto dismiss
  if (toast.duration !== Infinity) {
    setTimeout(() => {
      dismissToast(id);
    }, toast.duration || 5000);
  }

  return id;
};

// Action to dismiss a toast
export const dismissToast = (toastId: string) => {
  toasts = toasts.filter((t) => t.id !== toastId);
};

// Custom hook for toast management
export const useToast = (): ToastContext => {
  const [, setToastState] = useState<Toast[]>(toasts);

  const toast = (data: Omit<Toast, "id">) => {
    const id = addToast(data);
    setToastState([...toasts]);
    return id;
  };

  const dismiss = (toastId: string) => {
    dismissToast(toastId);
    setToastState([...toasts]);
  };

  return {
    toasts,
    toast,
    dismiss,
  };
};

// Standalone toast function for use outside of React components
export const toast = (data: Omit<Toast, "id">) => {
  return addToast(data);
};
