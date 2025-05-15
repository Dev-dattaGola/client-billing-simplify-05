
import * as React from "react";
import { ToastContext } from "@/contexts/ToastContext";

export interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
}

export interface Toast extends ToastOptions {
  id: string;
}

export type ToastContextType = {
  toast: (props: ToastOptions) => string;
  dismiss: (toastId?: string) => void;
  update: (props: ToastOptions & { id: string }) => void;
  toasts: Toast[];
};

export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}
