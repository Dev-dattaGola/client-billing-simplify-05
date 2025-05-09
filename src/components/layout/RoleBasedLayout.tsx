
import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RoleBasedLayoutProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  fallback?: ReactNode;
}

const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ 
  children, 
  requiredPermissions = [],
  requiredRoles = [],
  fallback = null 
}) => {
  const { hasPermission, currentUser } = useAuth();
  
  // Check if the user has any of the required permissions
  const hasPermissionAccess = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => hasPermission(permission));
    
  // Check if user has required role
  const hasRoleAccess = requiredRoles.length === 0 ||
    (currentUser && requiredRoles.includes(currentUser.role));
  
  // User has access if they meet permission OR role requirements
  const hasAccess = hasPermissionAccess || hasRoleAccess;
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default RoleBasedLayout;
