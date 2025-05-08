
import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RoleBasedLayoutProps {
  children: ReactNode;
  requiredPermissions?: string[];
  fallback?: ReactNode;
}

const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ 
  children, 
  requiredPermissions = [],
  fallback = null 
}) => {
  const { hasPermission } = useAuth();
  
  // Check if the user has any of the required permissions
  const hasAccess = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => hasPermission(permission));
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default RoleBasedLayout;
