
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  roles?: string[];
}

const ProtectedRoute = ({ children, requiredPermissions = [], roles = [] }: ProtectedRouteProps) => {
  const { isAuthenticated, currentUser, hasPermission, updateAuthState } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  // Force auth state refresh on mount
  useEffect(() => {
    updateAuthState();
  }, [updateAuthState]);
  
  // Debug logging
  console.log("ProtectedRoute: Auth state =", isAuthenticated, "User =", currentUser?.role);
  
  if (!isAuthenticated) {
    // This toast will be displayed only once, not from within render
    useEffect(() => {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
    }, []);
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Admin has access to everything
  if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
    return <>{children}</>;
  }
  
  // Check permissions for other users
  const hasPermissionAccess = requiredPermissions.length === 0 || 
    requiredPermissions.some(perm => hasPermission(perm));
  
  const hasRoleAccess = roles.length === 0 ||
    (currentUser && roles.includes(currentUser.role || ''));
  
  // Grant access if either permission or role checks pass
  if (!hasPermissionAccess && !hasRoleAccess) {
    useEffect(() => {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }, []);
    
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
