
import { useToast } from "@/hooks/use-toast";

export const useAuthToast = () => {
  const { toast } = useToast();
  
  const showAuthRequiredToast = () => {
    toast({
      title: "Authentication Required",
      description: "Please log in to access this page.",
      variant: "destructive",
    });
  };
  
  const showAccessDeniedToast = () => {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      variant: "destructive",
    });
  };
  
  return {
    showAuthRequiredToast,
    showAccessDeniedToast
  };
};
