
import { User } from '@/types/auth';

// Utility function to check if a user has a specific permission
export const checkPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  
  // Admin has all permissions
  if (user.role === 'admin') return true;
  
  // Attorney has all permissions except user management
  if (user.role === 'attorney') {
    if (permission.includes('create:users') || 
        permission.includes('edit:users') || 
        permission.includes('delete:users') ||
        permission.includes('admin:access')) {
      return false;
    }
    return true;
  }

  // Client permissions
  if (user.role === 'client') {
    // Explicitly define what clients can access
    const clientPermissions = [
      'view:documents',
      'upload:documents',
      'view:calendar', 
      'view:appointments',
      'view:messages',
      'send:messages'
    ];
    
    return clientPermissions.includes(permission);
  }
  
  // Check specific permission if user has permissions array
  if (user.permissions) {
    return user.permissions.includes(permission);
  }
  
  return false;
};

// Mock user data for demo logins
export const getMockUser = (email: string, password: string): User | null => {
  if (email === 'admin@lyzlawfirm.com' && password === 'admin123') {
    return {
      id: 'admin1',
      name: 'Admin User',
      email: 'admin@lyzlawfirm.com',
      role: 'admin',
      firmId: 'lyz001',
      permissions: [
        'admin:access',
        'manage:users',
        'manage:cases',
        'view:communications',
        'view:medical', 
        'view:cases',
        'access:all',
        'create:users',
        'edit:users',
        'delete:users',
        'view:clients',
        'edit:clients',
        'view:documents',
        'upload:documents',
        'view:calendar',
        'view:appointments',
        'view:messages',
        'send:messages',
        'view:billing',
        'manage:billing',
        'view:depositions'
      ]
    };
  } else if (email === 'attorney@lyzlawfirm.com' && password === 'attorney123') {
    return {
      id: 'attorney1',
      name: 'Attorney Smith',
      email: 'attorney@lyzlawfirm.com',
      role: 'attorney',
      firmId: 'lyz001',
      permissions: [
        'view:cases',
        'edit:cases',
        'view:clients',
        'edit:clients',
        'view:communications',
        'view:medical',
        'access:all',
        'view:documents',
        'upload:documents',
        'view:calendar',
        'view:appointments', 
        'view:messages',
        'send:messages',
        'view:billing',
        'view:depositions'
      ]
    };
  } else if (email === 'client@example.com' && password === 'client123') {
    return {
      id: 'client1',
      name: 'John Client',
      email: 'client@example.com',
      role: 'client',
      permissions: [
        'view:own_cases',
        'view:documents',
        'upload:documents',
        'view:calendar',
        'view:appointments',
        'view:messages',
        'send:messages'
      ]
    };
  }
  
  return null;
};

// Helper function to save authentication data
export const saveAuthData = (user: User, remember: boolean): string => {
  const token = 'mock-jwt-token-' + Math.random().toString(36).substr(2);
  
  // Store in localStorage or sessionStorage based on remember me
  const storage = remember ? localStorage : sessionStorage;
  
  storage.setItem('auth_token', token);
  storage.setItem('userData', JSON.stringify(user));
  storage.setItem('isAuthenticated', 'true');
  
  return token;
};

// Helper function to clear authentication data
export const clearAuthData = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('userData');
  localStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('userData');
  sessionStorage.removeItem('isAuthenticated');
};

// Helper function to restore authentication state
export const restoreAuthState = (): { user: User | null; isAuthenticated: boolean } => {
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const userDataStr = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    
    if (token && userDataStr) {
      const userData = JSON.parse(userDataStr);
      return { user: userData, isAuthenticated: true };
    }
  } catch (error) {
    console.error('Failed to restore authentication state:', error);
  }
  
  return { user: null, isAuthenticated: false };
};
