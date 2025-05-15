
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import LoadingScreen from "@/components/common/LoadingScreen";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  roles?: string[];
}

const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  roles = [] 
}: ProtectedRouteProps) => {
  const { isAuthenticated, currentUser, hasPermission, updateAuthState, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  // Force auth state refresh on mount
  useEffect(() => {
    updateAuthState();
  }, [updateAuthState]);
  
  // Handle authentication notifications
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page.",
          variant: "destructive",
        });
      } else if (
        !(currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && 
        requiredPermissions.length > 0 && 
        !requiredPermissions.some(perm => hasPermission(perm)) && 
        roles.length > 0 && 
        !(currentUser?.role && roles.includes(currentUser.role))
      ) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
      }
    }
  }, [isLoading, isAuthenticated, currentUser, requiredPermissions, roles, hasPermission, toast]);
  
  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Admin and superadmin have access to everything
  if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
    return <>{children}</>;
  }
  
  // Check permissions for other users
  const hasPermissionAccess = requiredPermissions.length === 0 || 
    requiredPermissions.some(perm => hasPermission(perm));
  
  const hasRoleAccess = roles.length === 0 ||
    (currentUser?.role && roles.includes(currentUser.role));
  
  // Grant access if either permission or role checks pass
  if (!hasPermissionAccess && !hasRoleAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
