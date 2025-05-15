
import { User } from '@/types/auth';

// Save authentication data to localStorage or sessionStorage
export const saveAuthData = (user: User, remember: boolean): void => {
  try {
    const userData = JSON.stringify(user);
    const authToken = generateAuthToken(user);
    
    if (remember) {
      localStorage.setItem('userData', userData);
      localStorage.setItem('authToken', authToken);
      // Clean up any session storage to avoid conflicts
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('authToken');
    } else {
      sessionStorage.setItem('userData', userData);
      sessionStorage.setItem('authToken', authToken);
      // Clean up any local storage to avoid conflicts
      localStorage.removeItem('userData');
      localStorage.removeItem('authToken');
    }
    
    console.log(`Auth data saved for ${user.name || user.email} in ${remember ? 'localStorage' : 'sessionStorage'}`);
  } catch (error) {
    console.error('Error saving auth data:', error);
    throw new Error('Failed to save authentication data');
  }
};

// Clear authentication data from both storages
export const clearAuthData = (): void => {
  try {
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    console.log('Auth data cleared');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

// Restore authentication state from localStorage or sessionStorage
export const restoreAuthState = (): { user: User | null; isAuthenticated: boolean } => {
  try {
    // Check if token exists in either storage
    const tokenExists = !!localStorage.getItem('authToken') || !!sessionStorage.getItem('authToken');
    console.log(`Restoring auth state, token exists: ${tokenExists} user data exists: ${!!localStorage.getItem('userData') || !!sessionStorage.getItem('userData')}`);
    
    // Prioritize session storage for user data
    const userDataStr = sessionStorage.getItem('userData') || localStorage.getItem('userData');
    
    if (!userDataStr) {
      return { user: null, isAuthenticated: false };
    }
    
    const userData: User = JSON.parse(userDataStr);
    
    if (!userData || !userData.id || !userData.role) {
      console.warn('Invalid user data found in storage');
      clearAuthData(); // Clear invalid data
      return { user: null, isAuthenticated: false };
    }
    
    return { user: userData, isAuthenticated: true };
  } catch (error) {
    console.error('Error restoring auth state:', error);
    clearAuthData(); // Clear potentially corrupted data
    return { user: null, isAuthenticated: false };
  }
};

// Generate a mock auth token (in a real app, this would come from the backend)
const generateAuthToken = (user: User): string => {
  const payload = {
    id: user.id,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hour expiration
  };
  
  return btoa(JSON.stringify(payload));
};

// Check if a user has a specific permission
export const checkPermission = (user: User, permission: string): boolean => {
  // Admin always has all permissions
  if (user.role === 'admin' || user.role === 'superadmin') {
    return true;
  }
  
  // For other roles, use role-based permissions since our User type doesn't have a permissions array
  if (user.role === 'attorney') {
    const attorneyPermissions = [
      'view:clients', 'edit:clients',
      'view:cases', 'create:cases', 'edit:cases',
      'view:documents', 'upload:documents', 'download:documents',
      'view:calendar', 'create:events', 'edit:events',
      'view:reports'
    ];
    
    return attorneyPermissions.includes(permission);
  } else if (user.role === 'client') {
    const clientPermissions = [
      'view:documents', 'upload:documents', 'download:documents',
      'view:calendar', 'view:appointments',
      'view:messages', 'send:messages'
    ];
    
    return clientPermissions.includes(permission);
  }
  
  return false;
};

// Mock users for demonstration
export const getMockUser = (email: string, password: string): User | null => {
  // Normalize email for comparison to avoid case sensitivity issues
  const normalizedEmail = email.toLowerCase().trim();
  
  const users = [
    {
      id: 'admin1',
      name: 'Admin User',
      email: 'admin@lyzlawfirm.com',
      role: 'admin',
      firmId: 'firm1',
      permissions: ['all'],
      password: 'admin123'
    },
    {
      id: 'attorney1',
      name: 'Attorney User',
      email: 'attorney@lyzlawfirm.com',
      role: 'attorney',
      firmId: 'firm1',
      permissions: ['view:clients', 'edit:clients', 'view:cases', 'edit:cases'],
      password: 'attorney123'
    },
    {
      id: 'client1',
      name: 'Client User',
      email: 'client@example.com',
      role: 'client',
      assignedAttorneyId: 'attorney1',
      permissions: ['view:documents', 'upload:documents'],
      password: 'client123'
    },
    // Add more mock users as needed
  ];

  const user = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password);
  
  if (user) {
    // Don't return the password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  return null;
};
