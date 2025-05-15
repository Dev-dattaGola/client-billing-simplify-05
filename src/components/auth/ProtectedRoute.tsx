
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthToast } from "@/hooks/useAuthToast";
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
  const { showAuthRequiredToast, showAccessDeniedToast } = useAuthToast();
  const location = useLocation();
  
  // Force auth state refresh on mount, but only once
  useEffect(() => {
    // Only update if we're not already loading
    if (!isLoading) {
      updateAuthState();
    }
  }, [updateAuthState, isLoading]);
  
  // Handle authentication notifications, but only after initial load
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        showAuthRequiredToast();
      } else if (
        !(currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && 
        requiredPermissions.length > 0 && 
        !requiredPermissions.some(perm => hasPermission(perm)) && 
        roles.length > 0 && 
        !(currentUser?.role && roles.includes(currentUser.role))
      ) {
        showAccessDeniedToast();
      }
    }
  }, [isLoading, isAuthenticated, currentUser, requiredPermissions, roles, hasPermission, showAuthRequiredToast, showAccessDeniedToast]);
  
  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login from:', location.pathname);
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
