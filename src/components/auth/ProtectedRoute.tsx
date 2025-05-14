
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
  const { isAuthenticated, currentUser, hasPermission } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  useEffect(() => {
    // Only show toast notifications when authentication status changes
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, toast]);
  
  if (!isAuthenticated) {
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
    // Move the toast notification to a useEffect instead of rendering it directly
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
