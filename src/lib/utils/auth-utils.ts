
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

// Mock user data for demo logins with case-insensitive email matching
export const getMockUser = (email: string, password: string): User | null => {
  console.log("Attempting to get mock user for:", email);
  
  // Convert email to lowercase for comparison
  const normalizedEmail = email.toLowerCase();
  
  if (normalizedEmail === 'admin@lyzlawfirm.com' && password === 'admin123') {
    console.log("Admin credentials match");
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
  } else if (normalizedEmail === 'attorney@lyzlawfirm.com' && password === 'attorney123') {
    console.log("Attorney credentials match");
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
  } else if (normalizedEmail === 'client@example.com' && password === 'client123') {
    console.log("Client credentials match");
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
  
  console.log("No matching credentials found");
  return null;
};

// Helper function to save authentication data
export const saveAuthData = (user: User, remember: boolean): string => {
  const token = 'mock-jwt-token-' + Math.random().toString(36).substr(2);
  
  // Store in localStorage or sessionStorage based on remember me
  const storage = remember ? localStorage : sessionStorage;
  
  try {
    storage.setItem('auth_token', token);
    storage.setItem('userData', JSON.stringify(user));
    storage.setItem('isAuthenticated', 'true');
    console.log("Auth data saved successfully to", remember ? "localStorage" : "sessionStorage");
  } catch (error) {
    console.error("Error saving auth data:", error);
  }
  
  return token;
};

// Helper function to clear authentication data
export const clearAuthData = (): void => {
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('isAuthenticated');
    console.log("Auth data cleared successfully");
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};

// Helper function to restore authentication state
export const restoreAuthState = (): { user: User | null; isAuthenticated: boolean } => {
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const userDataStr = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    
    console.log("Restoring auth state, token exists:", !!token, "user data exists:", !!userDataStr);
    
    if (token && userDataStr) {
      const userData = JSON.parse(userDataStr);
      return { user: userData, isAuthenticated: true };
    }
  } catch (error) {
    console.error('Failed to restore authentication state:', error);
  }
  
  return { user: null, isAuthenticated: false };
};
