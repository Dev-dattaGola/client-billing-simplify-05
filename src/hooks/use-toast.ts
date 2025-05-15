
import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";
import { ToastContext } from "@/contexts/ToastContext";

export interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
}

export type ToastContextType = {
  toast: (props: ToastOptions) => void;
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

export interface Toast extends ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
}
