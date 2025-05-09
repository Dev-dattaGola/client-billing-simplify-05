
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  roles?: string[];
}

const ProtectedRoute = ({ children, requiredPermissions = [], roles = [] }: ProtectedRouteProps) => {
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
    } else if (
      (requiredPermissions.length > 0 && !requiredPermissions.some(perm => hasPermission(perm))) &&
      (roles.length > 0 && !roles.includes(currentUser?.role || ''))
    ) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, requiredPermissions, hasPermission, roles, currentUser, toast]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Admin has access to everything
  if (currentUser?.role === 'admin') {
    return <>{children}</>;
  }
  
  // Check permissions for other users
  const hasPermissionAccess = requiredPermissions.length === 0 || 
    requiredPermissions.some(perm => hasPermission(perm));
  
  const hasRoleAccess = roles.length === 0 ||
    (currentUser && roles.includes(currentUser.role || ''));
  
  // Grant access if either permission or role checks pass
  if (!hasPermissionAccess && !hasRoleAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
