
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  firmId?: string;
  permissions?: string[];
}

interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  updateAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Enhanced Authentication Management
  const updateAuthState = () => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const userDataStr = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      
      if (token && userDataStr) {
        const userData = JSON.parse(userDataStr);
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to restore authentication state:', error);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateAuthState();
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (credentials: LoginCredentials): Promise<User | null> => {
    setIsLoading(true);
    
    try {
      // For demo purposes - would be an actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let user = null;
      
      // Use demo credentials for test logins
      if (credentials.email === 'admin@lyzlawfirm.com' && credentials.password === 'admin123') {
        user = {
          id: 'admin1',
          name: 'Admin User',
          email: 'admin@lyzlawfirm.com',
          role: 'admin',
          firmId: 'lyz001',
          // Fix: Added view:communications permission to admin
          permissions: ['admin:access', 'manage:users', 'manage:cases', 'view:communications', 'view:medical', 'view:cases', 'access:all']
        };
      } else if (credentials.email === 'attorney@lyzlawfirm.com' && credentials.password === 'attorney123') {
        user = {
          id: 'attorney1',
          name: 'Attorney Smith',
          email: 'attorney@lyzlawfirm.com',
          role: 'attorney',
          firmId: 'lyz001',
          // Fix: Added view:communications permission to attorney
          permissions: ['view:cases', 'edit:cases', 'view:clients', 'view:communications', 'view:medical', 'access:all']
        };
      } else if (credentials.email === 'client@example.com' && credentials.password === 'client123') {
        user = {
          id: 'client1',
          name: 'John Client',
          email: 'client@example.com',
          role: 'client',
          // Fix: Added view:communications permission to client
          permissions: ['view:own_cases', 'upload:documents', 'view:communications']
        };
      } else {
        toast.error('Invalid email or password');
        setIsLoading(false);
        return null;
      }

      // Save authentication data
      const token = 'mock-jwt-token-' + Math.random().toString(36).substr(2);
      
      // Store in localStorage or sessionStorage based on remember me
      if (credentials.remember) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        sessionStorage.setItem('auth_token', token);
        sessionStorage.setItem('userData', JSON.stringify(user));
        sessionStorage.setItem('isAuthenticated', 'true');
      }
      
      // Update state
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${user.name}!`);
      
      // Navigate to dashboard or originally requested page
      const origin = location.state?.from?.pathname || '/dashboard';
      navigate(origin);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('isAuthenticated');
    
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    toast.success('You have been logged out');
    navigate('/login');
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser || !currentUser.permissions) return false;
    
    if (currentUser.role === 'superadmin') return true;
    
    // Fix: Always grant access to communication features
    if (permission === 'view:communications') return true;
    
    return currentUser.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        currentUser,
        login,
        logout,
        hasPermission,
        updateAuthState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
