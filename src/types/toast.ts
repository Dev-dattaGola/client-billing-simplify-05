
import * as React from "react";

export interface ToastProps {
  id: string;
  open: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
  duration?: number;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export interface ToastActionElement {
  altText: string;
  action: React.ReactNode;
}

export type ToastType = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export type ToasterToast = ToastType;

export interface ToastContextType {
  toasts: ToasterToast[];
  toast: (props: Omit<ToasterToast, "id" | "open">) => string;
  dismiss: (toastId?: string) => void;
  update: (id: string, props: Omit<ToasterToast, "id">) => void;
}
