
import * as React from "react";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";
import { ToastType } from "@/types/toast";

export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}

export type { ToastType };
