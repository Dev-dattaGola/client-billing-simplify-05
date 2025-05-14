
import { useState, useEffect, createContext, useContext } from "react";
import { toast as sonnerToast, type Toast } from "sonner";

type ToastProps = Toast & {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

const ToastContext = createContext<{
  toast: (props: ToastProps) => void;
} | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    // Create a standalone implementation if used outside provider
    return {
      toast: (props: ToastProps) => {
        if (props.variant === "destructive") {
          sonnerToast.error(props.title, {
            description: props.description,
          });
        } else {
          sonnerToast(props.title, {
            description: props.description,
          });
        }
      }
    };
  }
  
  return context;
};

export const toast = (props: ToastProps) => {
  if (props.variant === "destructive") {
    sonnerToast.error(props.title, {
      description: props.description,
    });
  } else {
    sonnerToast(props.title, {
      description: props.description,
    });
  }
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (props: ToastProps) => {
    if (props.variant === "destructive") {
      sonnerToast.error(props.title, {
        description: props.description,
      });
    } else {
      sonnerToast(props.title, {
        description: props.description,
      });
    }
    setToasts(prev => [...prev, props]);
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
    </ToastContext.Provider>
  );
};
