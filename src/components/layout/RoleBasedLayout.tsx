
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
  
  // Superadmin always has access to everything
  if (currentUser?.role === 'superadmin') {
    return <>{children}</>;
  }
  
  // Admin has access to everything except superadmin features
  if (currentUser?.role === 'admin') {
    const isSuperAdminOnly = requiredRoles.includes('superadmin');
    
    if (!isSuperAdminOnly) {
      return <>{children}</>;
    }
    
    return <>{fallback}</>;
  }
  
  // Attorney has access to attorney and client features
  if (currentUser?.role === 'attorney') {
    const isAdminFeature = requiredRoles.includes('admin') || 
                           requiredRoles.includes('superadmin') ||
                           requiredPermissions.some(p => p.includes('admin:'));
    
    if (!isAdminFeature) {
      return <>{children}</>;
    }
    
    return <>{fallback}</>;
  }
  
  // Client has restricted access
  if (currentUser?.role === 'client') {
    const clientPermissions = [
      'view:documents', 'upload:documents', 'download:documents',
      'view:calendar', 'view:appointments',
      'view:messages', 'send:messages'
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
    (currentUser?.role && requiredRoles.includes(currentUser.role));
  
  if (hasPermissionAccess || hasRoleAccess) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default RoleBasedLayout;
