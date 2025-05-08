
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  currentUser: UserData | null;
  hasPermission: (permission: string) => boolean;
}

interface UserData {
  name?: string;
  email: string;
  role: 'admin' | 'attorney' | 'client';
  permissions: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Predefined users with roles and permissions
const predefinedUsers = [
  {
    email: 'admin@lawerp.com',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin',
    permissions: ['all', 'create:users', 'manage:users', 'access:all'],
  },
  {
    email: 'attorney@lawerp.com',
    password: 'admin123',
    name: 'Attorney User',
    role: 'attorney',
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
    email: 'client@lawerp.com',
    password: 'admin123',
    name: 'Client User',
    role: 'client',
    permissions: [
      'view:documents', 'upload:documents',
      'view:messages', 'send:messages',
      'view:appointments'
    ],
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
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
        const userData: UserData = {
          name: user.name,
          email: user.email,
          role: user.role as 'admin' | 'attorney' | 'client',
          permissions: user.permissions
        };

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
        setIsAuthenticated(true);
        setCurrentUser(userData);
        resolve();
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/login');
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    // Admin has all permissions
    if (currentUser.role === 'admin' || currentUser.permissions.includes('all')) {
      return true;
    }
    
    // Check if user has the specific permission
    return currentUser.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      currentUser,
      hasPermission 
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
