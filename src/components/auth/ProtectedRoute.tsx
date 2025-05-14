
import { ReactNode, useEffect, useRef } from "react";
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
  const hasNotifiedRef = useRef(false);
  
  useEffect(() => {
    // Only show toast notifications when authentication status changes and hasn't been notified
    if (!isAuthenticated && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, toast]);
  
  // Reset notification flag when route changes
  useEffect(() => {
    return () => {
      hasNotifiedRef.current = false;
    };
  }, [location.pathname]);
  
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
    // Use useRef to track if access denied notification has been shown
    const accessDeniedRef = useRef(false);
    
    useEffect(() => {
      if (!accessDeniedRef.current) {
        accessDeniedRef.current = true;
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
      }
    }, []);
    
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
