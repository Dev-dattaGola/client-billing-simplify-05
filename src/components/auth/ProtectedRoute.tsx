
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  roles?: string[];
}

const ProtectedRoute = ({ children, requiredPermissions = [], roles = [] }: ProtectedRouteProps) => {
  const { isAuthenticated, currentUser, hasPermission, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  useEffect(() => {
    // Log for debugging
    console.log("ProtectedRoute checking auth:", { 
      isAuthenticated, 
      currentUser: currentUser?.email, 
      path: location.pathname,
      isLoading
    });
    
    if (!isLoading && !isAuthenticated) {
      console.log("Not authenticated, will redirect to login");
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      setShouldRedirect(true);
    }
  }, [isAuthenticated, currentUser, location.pathname, isLoading, toast]);
  
  if (isLoading) {
    return <div className="flex h-full w-full items-center justify-center">Loading...</div>;
  }
  
  if (shouldRedirect || !isAuthenticated) {
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
    // Use useEffect to handle this toast and navigation
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
