
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { useAuthActions } from '@/hooks/useAuthActions';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<User | null>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { login, logout, hasPermission, isLoading: authActionsLoading } = useAuthActions();

  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        const userDataString = localStorage.getItem('userData') || sessionStorage.getItem('userData');
        
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          
          // Update user name based on role
          if (userData.role === 'client') {
            userData.name = 'Andrew Johnson';
          } else if (userData.role === 'attorney') {
            userData.name = 'Jack Peters';
          } else if (userData.role === 'admin') {
            userData.name = 'Smith Hook';
          }
          
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error parsing user data from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserFromStorage();
  }, []);

  const handleLogin = async (email: string, password: string, remember: boolean) => {
    const user = await login(email, password, remember);
    
    // Update user name based on role before setting to state
    if (user) {
      if (user.role === 'client') {
        user.name = 'Andrew Johnson';
      } else if (user.role === 'attorney') {
        user.name = 'Jack Peters';
      } else if (user.role === 'admin') {
        user.name = 'Smith Hook';
      }
      setCurrentUser(user);
    }
    
    return user;
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  const contextValue = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading: isLoading || authActionsLoading,
    login: handleLogin,
    logout: handleLogout,
    hasPermission: hasPermission,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
