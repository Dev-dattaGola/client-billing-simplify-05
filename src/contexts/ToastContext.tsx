
import React, { createContext, useContext, useState } from "react";
import type { ToastProps } from "@/components/ui/toast";

export interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

export type ToastActionElement = React.ReactElement<typeof ToastAction>;

export type ToastContextType = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  updateToast: (id: string, toast: Partial<Omit<Toast, "id">>) => void;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { ...toast, id }]);

    if (toast.duration !== Infinity) {
      setTimeout(() => {
        dismissToast(id);
      }, toast.duration || 5000);
    }

    return id;
  };

  const updateToast = (id: string, toast: Partial<Omit<Toast, "id">>) => {
    setToasts((current) =>
      current.map((t) => (t.id === id ? { ...t, ...toast } : t))
    );
  };

  const dismissToast = (id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  };

  const dismissAll = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        updateToast,
        dismissToast,
        dismissAll,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

// Use the ToastContext to consume the values with a custom hook
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return {
    toast: (props: ToastProps) => {
      context.addToast(props);
    },
    dismiss: (id: string) => {
      context.dismissToast(id);
    },
    dismissAll: () => {
      context.dismissAll();
    },
  };
}

export interface ToastActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  altText?: string;
}

export const ToastAction = ({ altText, ...props }: ToastActionProps) => {
  return (
    <button
      className="inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-transparent hover:bg-secondary border border-border h-8 py-2 px-4 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
      {...props}
    >
      {altText}
    </button>
  );
};
