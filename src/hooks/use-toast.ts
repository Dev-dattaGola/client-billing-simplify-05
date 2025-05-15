
import { useToast as useToastUI } from "@/components/ui/use-toast";
import { toast as toastUI } from "@/components/ui/use-toast";

// Reexport the toast hook and function
export const useToast = useToastUI;
export const toast = toastUI;
