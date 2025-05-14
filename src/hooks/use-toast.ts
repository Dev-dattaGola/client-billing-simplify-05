
import { toast as sonnerToast } from "sonner";
import * as React from "react";

type ToastProps = React.ComponentProps<typeof sonnerToast>;

const useToast = () => {
  const toast = React.useMemo(
    () => ({
      toast: sonnerToast,
      success: (message: string, options?: ToastProps) => sonnerToast.success(message, options),
      error: (message: string, options?: ToastProps) => sonnerToast.error(message, options),
      info: (message: string, options?: ToastProps) => sonnerToast.info(message, options),
      warning: (message: string, options?: ToastProps) => sonnerToast.warning(message, options),
    }),
    []
  );

  return toast;
};

export { useToast, sonnerToast as toast };
