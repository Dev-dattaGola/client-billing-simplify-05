
import * as React from "react";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";
import { ToastType } from "@/types/toast";

export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext);
  
  return context;
}

export type { ToastType };
