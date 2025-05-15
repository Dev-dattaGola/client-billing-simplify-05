
import * as React from "react";
import type { Toast, ToastContextType, ToastOptions } from "@/hooks/use-toast";

export const ToastContext = React.createContext<ToastContextType>({
  toast: () => {},
  dismiss: () => {},
  update: () => {},
  toasts: [],
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback(({ ...props }: ToastOptions) => {
    const id = String(Date.now());
    
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, ...props } as Toast,
    ]);

    return id;
  }, []);

  const dismiss = React.useCallback((toastId?: string) => {
    setToasts((prevToasts) => 
      toastId 
        ? prevToasts.filter((toast) => toast.id !== toastId)
        : []
    );
  }, []);

  const update = React.useCallback(
    ({ id, ...props }: ToastOptions & { id: string }) => {
      setToasts((prevToasts) =>
        prevToasts.map((toast) =>
          toast.id === id ? { ...toast, ...props } as Toast : toast
        )
      );
    },
    []
  );

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
