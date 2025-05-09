
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
  
  // Admin always has access to everything
  if (currentUser?.role === 'admin') {
    return <>{children}</>;
  }
  
  // Attorney has access to everything except admin features
  if (currentUser?.role === 'attorney') {
    const isAdminFeature = requiredRoles.includes('admin') || 
                           requiredPermissions.some(p => p.includes('admin:') || 
                                                       p.includes('create:users') ||
                                                       p.includes('edit:users') ||
                                                       p.includes('delete:users'));
    
    if (!isAdminFeature) {
      return <>{children}</>;
    }
    
    return <>{fallback}</>;
  }
  
  // Client has restricted access
  if (currentUser?.role === 'client') {
    const clientPermissions = [
      'view:documents',
      'upload:documents',
      'view:calendar', 
      'view:appointments',
      'view:messages',
      'send:messages'
    ];
    
    const hasAccess = requiredPermissions.some(perm => clientPermissions.includes(perm)) || 
                     requiredRoles.includes('client');
    
    if (hasAccess) {
      return <>{children}</>;
    }
    
    return <>{fallback}</>;
  }
  
  // For other roles, check specific permissions and roles
  const hasPermissionAccess = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => hasPermission(permission));
    
  const hasRoleAccess = requiredRoles.length === 0 ||
    (currentUser && requiredRoles.includes(currentUser.role));
  
  if (hasPermissionAccess || hasRoleAccess) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default RoleBasedLayout;
