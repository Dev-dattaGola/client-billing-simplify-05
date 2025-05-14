
import { useToast as useToastInternal, toast as toastInternal } from "@/components/ui/use-toast";

/**
 * Hook for using toast notifications
 * Using memoized version to prevent re-renders
 */
export const useToast = useToastInternal;

/**
 * Direct toast function for use outside of React components
 */
export const toast = toastInternal;

export default useToast;
