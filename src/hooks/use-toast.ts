
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import { useToast as useToastPrimitive } from "@/components/ui/use-toast";

export type ToastType = ToastProps & {
  action?: ToastActionElement;
};

export const useToast = () => {
  const { toast, ...rest } = useToastPrimitive();

  function showToast(props: ToastType) {
    toast(props);
  }

  return {
    toast: showToast,
    ...rest,
  };
};

export type { Toast };
