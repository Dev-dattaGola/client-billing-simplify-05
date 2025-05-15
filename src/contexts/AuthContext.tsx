
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import { LoginCredentials } from '@/types/auth';
import { saveAuthData, clearAuthData, checkPermission, getMockUser } from '@/lib/utils/auth-utils';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Initialize auth state from localStorage or sessionStorage
  useEffect(() => {
    const initAuthState = () => {
      try {
        const userDataStr = localStorage.getItem('userData') || sessionStorage.getItem('userData');
        
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        // Clear potentially corrupted auth data
        localStorage.removeItem('userData');
        sessionStorage.removeItem('userData');
      } finally {
        setIsLoading(false);
      }
    };

    initAuthState();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User | null> => {
    setIsLoading(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = getMockUser(credentials.email, credentials.password);
      
      if (!user) {
        return null;
      }
      
      // Save to storage based on 'remember' flag
      saveAuthData(user, credentials.remember || false);
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setCurrentUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    return checkPermission(currentUser, permission);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    login,
    logout,
    hasPermission
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
