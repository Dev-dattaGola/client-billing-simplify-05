
import * as React from "react";
import { ToastContext } from "@/contexts/ToastContext";
import { ToastType, ToastActionElement } from "@/types/toast";

export function useToast() {
  const { toast, dismiss, update, toasts } = React.useContext(ToastContext);
  
  return {
    toast,
    dismiss,
    update,
    toasts,
  };
}

export type { ToastType, ToastActionElement };
