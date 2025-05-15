
import { User } from '@/types/user';

export const saveAuthData = (user: User, remember: boolean): void => {
  const storage = remember ? localStorage : sessionStorage;
  
  // Remove from the other storage to avoid conflicts
  if (remember) {
    sessionStorage.removeItem('userData');
  } else {
    localStorage.removeItem('userData');
  }
  
  try {
    storage.setItem('userData', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

export const clearAuthData = (): void => {
  localStorage.removeItem('userData');
  sessionStorage.removeItem('userData');
};

export const getAuthData = (): User | null => {
  try {
    const userDataStr = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (userDataStr) {
      return JSON.parse(userDataStr);
    }
  } catch (error) {
    console.error('Error getting auth data:', error);
  }
  return null;
};

export const checkPermission = (user: User, permission: string): boolean => {
  if (!user || !user.permissions) return false;
  
  // Super admin has all permissions
  if (user.role === 'superadmin') return true;
  
  // Check if the user has the specific permission
  return user.permissions.includes(permission);
};

// Mock users for testing (in a real app, this would come from your API)
const mockUsers = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    permissions: ['view_dashboard', 'manage_users', 'manage_settings'],
    isActive: true
  },
  {
    id: 'attorney-1',
    name: 'Attorney User',
    email: 'attorney@example.com',
    role: 'attorney',
    permissions: ['view_dashboard', 'manage_clients', 'view_cases'],
    isActive: true
  },
  {
    id: 'client-1',
    name: 'Client User',
    email: 'client@example.com',
    role: 'client',
    permissions: ['view_dashboard', 'view_documents'],
    assignedAttorneyId: 'attorney-1',
    isActive: true
  },
  {
    id: 'superadmin-1',
    name: 'Super Admin',
    email: 'superadmin@example.com',
    role: 'superadmin',
    permissions: ['*'],
    isActive: true
  }
];

export const getMockUser = (email: string, password: string): User | null => {
  // In this mock function, we're simply checking the email and ignoring the password
  // In a real app, you would validate both email and password
  const user = mockUsers.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && u.isActive
  );
  
  return user ? { ...user } : null;
};

export const isMockUser = (email: string): boolean => {
  return mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
};
