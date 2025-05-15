
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  
  // Debug auth state
  console.log("ProtectedRoute: Auth state =", isAuthenticated, "User =", currentUser?.role);
  
  useEffect(() => {
    console.log("ProtectedRoute mounted - path:", location.pathname);
    
    return () => {
      console.log("ProtectedRoute unmounted - path:", location.pathname);
    };
  }, [location.pathname]);
  
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    toast({
      title: "Authentication Required",
      description: "Please log in to access this page.",
      variant: "destructive",
    });
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
    (currentUser && roles.includes(currentUser.role));
  
  // Grant access if either permission or role checks pass
  if (!hasPermissionAccess && !hasRoleAccess) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
