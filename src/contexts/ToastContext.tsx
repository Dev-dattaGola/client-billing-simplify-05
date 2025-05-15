
import * as React from "react";
import type { ToastProps } from "@/components/ui/toast";
import { useToast as useToastInternal } from "@/components/ui/use-toast";
import type { ToastContextType } from "@/hooks/use-toast";

export const ToastContext = React.createContext<ToastContextType>({
  toast: () => {},
  dismiss: () => {},
  update: () => {},
  toasts: [],
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toast, dismiss, update, toasts } = useToastInternal();

  return (
    <ToastContext.Provider value={{ toast, dismiss, update, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}
