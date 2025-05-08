
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { User } from '@/types/user';
import apiClient from '@/lib/api/api-client';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  currentUser: User | null;
  hasPermission: (permission: string) => boolean;
  assignClientToAttorney: (clientId: string, attorneyId: string) => Promise<boolean>;
  getAssignedClients: (attorneyId: string) => Promise<string[]>;
  getAssignedAttorney: (clientId: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Predefined users with roles and permissions
const predefinedUsers = [
  {
    id: 'superadmin1',
    email: 'superadmin@lawerp.com',
    password: 'super@admin$$',
    name: 'Super Administrator',
    role: 'superadmin',
    permissions: ['all', 'manage:firms', 'manage:admins', 'view:all'],
  },
  {
    id: 'admin1',
    email: 'admin@lawerp.com',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin',
    firmId: 'firm1',
    permissions: ['all', 'create:users', 'manage:users', 'access:all'],
  },
  {
    id: 'attorney1',
    email: 'attorney@lawerp.com',
    password: 'admin123',
    name: 'Attorney User',
    role: 'attorney',
    firmId: 'firm1',
    assignedClientIds: ['client1'],
    permissions: [
      'view:clients', 'edit:clients', 
      'view:cases', 'edit:cases',
      'view:documents', 'edit:documents',
      'view:calendar', 'edit:calendar',
      'view:billing', 'edit:billing',
      'view:depositions', 'edit:depositions',
      'view:medical', 'edit:medical',
      'view:messages', 'send:messages'
    ],
  },
  {
    id: 'client1',
    email: 'client@lawerp.com',
    password: 'admin123',
    name: 'Client User',
    role: 'client',
    firmId: 'firm1',
    assignedAttorneyId: 'attorney1',
    permissions: [
      'view:documents', 'upload:documents',
      'view:messages', 'send:messages',
      'view:appointments'
    ],
  }
];

// Mock firm data
const mockFirms = [
  {
    id: 'firm1',
    name: 'LYZ Law Firm',
    adminId: 'admin1',
    address: '123 Legal St, Lawtown, CA 90210',
    contactNumber: '(555) 123-4567',
    email: 'contact@lyzlawfirm.com',
    website: 'www.lyzlawfirm.com',
    createdAt: new Date().toISOString(),
    createdBy: 'superadmin1'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      
      // Get stored user data
      const userData = localStorage.getItem('userData');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      // Find user in predefined users
      const user = predefinedUsers.find(u => u.email === email);
      
      if (user && user.password === password) {
        const userData: User = {
          id: user.id,
          name: user.name || '',
          email: user.email,
          role: user.role as 'superadmin' | 'admin' | 'attorney' | 'client',
          firmId: user.firmId,
          assignedAttorneyId: user.assignedAttorneyId,
          assignedClientIds: user.assignedClientIds,
          permissions: user.permissions
        };

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('auth_token', 'mock_jwt_token'); // In production, this would be a real JWT
        
        setIsAuthenticated(true);
        setCurrentUser(userData);
        
        // In a real app, we would also want to store the JWT token
        // and use it for API requests
        
        resolve();
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/login');
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    // Super Admin and Admin have all permissions
    if (currentUser.role === 'superadmin' || 
        (currentUser.role === 'admin' && currentUser.permissions.includes('all'))) {
      return true;
    }
    
    // Check if user has the specific permission
    return currentUser.permissions.includes(permission);
  };

  const assignClientToAttorney = async (clientId: string, attorneyId: string): Promise<boolean> => {
    try {
      // In a real app, this would make an API call to update the database
      // For now, we'll just update our in-memory storage
      
      // Update the client's assignedAttorneyId
      const clientIndex = predefinedUsers.findIndex(user => user.id === clientId && user.role === 'client');
      if (clientIndex !== -1) {
        predefinedUsers[clientIndex].assignedAttorneyId = attorneyId;
      }
      
      // Update the attorney's assignedClientIds
      const attorneyIndex = predefinedUsers.findIndex(user => user.id === attorneyId && user.role === 'attorney');
      if (attorneyIndex !== -1) {
        if (!predefinedUsers[attorneyIndex].assignedClientIds) {
          predefinedUsers[attorneyIndex].assignedClientIds = [];
        }
        
        if (!predefinedUsers[attorneyIndex].assignedClientIds!.includes(clientId)) {
          predefinedUsers[attorneyIndex].assignedClientIds!.push(clientId);
        }
      }
      
      // If the current user is the client or attorney that was updated, update the currentUser state
      if (currentUser?.id === clientId) {
        setCurrentUser({
          ...currentUser,
          assignedAttorneyId: attorneyId
        });
        localStorage.setItem('userData', JSON.stringify({
          ...currentUser,
          assignedAttorneyId: attorneyId
        }));
      }
      
      if (currentUser?.id === attorneyId) {
        const updatedClientIds = [...(currentUser.assignedClientIds || [])];
        if (!updatedClientIds.includes(clientId)) {
          updatedClientIds.push(clientId);
        }
        
        setCurrentUser({
          ...currentUser,
          assignedClientIds: updatedClientIds
        });
        
        localStorage.setItem('userData', JSON.stringify({
          ...currentUser,
          assignedClientIds: updatedClientIds
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Error assigning client to attorney:', error);
      return false;
    }
  };

  const getAssignedClients = async (attorneyId: string): Promise<string[]> => {
    try {
      // In a real app, this would make an API call to fetch from the database
      const attorney = predefinedUsers.find(user => user.id === attorneyId && user.role === 'attorney');
      return attorney?.assignedClientIds || [];
    } catch (error) {
      console.error('Error getting assigned clients:', error);
      return [];
    }
  };

  const getAssignedAttorney = async (clientId: string): Promise<string | null> => {
    try {
      // In a real app, this would make an API call to fetch from the database
      const client = predefinedUsers.find(user => user.id === clientId && user.role === 'client');
      return client?.assignedAttorneyId || null;
    } catch (error) {
      console.error('Error getting assigned attorney:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      currentUser,
      hasPermission,
      assignClientToAttorney,
      getAssignedClients,
      getAssignedAttorney
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
