
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, LoginCredentials } from '@/types/auth';
import { useAuthActions } from '@/hooks/useAuthActions';

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Move all hooks to the top level of the function component
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { login: authLogin, logout: authLogout, hasPermission, isLoading: authActionsLoading } = useAuthActions();

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

  const handleLogin = async (credentials: LoginCredentials) => {
    const user = await authLogin(credentials);
    
    if (user) {
      // Update user name based on role before setting to state
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
    authLogout();
    setCurrentUser(null);
  };

  const updateAuthState = () => {
    const userDataString = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error updating auth state:', error);
      }
    }
  };

  // Create the context value object
  const contextValue: AuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading: isLoading || authActionsLoading,
    login: handleLogin,
    logout: handleLogout,
    hasPermission,
    updateAuthState,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
