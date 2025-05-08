
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
}

const ProtectedRoute = ({ children, requiredPermissions = [] }: ProtectedRouteProps) => {
  const { isAuthenticated, currentUser, hasPermission } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
    } else if (requiredPermissions.length > 0 && !requiredPermissions.some(perm => hasPermission(perm))) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, requiredPermissions, hasPermission, toast]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if user has any of the required permissions
  if (requiredPermissions.length > 0 && !requiredPermissions.some(perm => hasPermission(perm))) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
