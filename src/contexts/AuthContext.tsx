
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, LoginCredentials } from '@/types/auth';
import { useAuthActions } from '@/hooks/useAuthActions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const { login, logout, hasPermission, isLoading: authActionsLoading } = useAuthActions();

  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        console.log("AuthProvider: Getting user from storage");
        const userDataString = localStorage.getItem('userData') || sessionStorage.getItem('userData');
        
        if (userDataString) {
          console.log("AuthProvider: Found user data in storage");
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
        } else {
          console.log("AuthProvider: No user data found in storage");
        }
      } catch (error) {
        console.error('Error parsing user data from storage:', error);
      } finally {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    getUserFromStorage();
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    const user = await login(credentials);
    
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

  const updateAuthState = () => {
    console.log("AuthProvider: Updating auth state");
    const userDataString = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        console.log("AuthProvider: Updated user data:", userData.email);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error updating auth state:', error);
      }
    } else {
      console.log("AuthProvider: No user data found when updating auth state");
      setCurrentUser(null);
    }
  };

  const contextValue: AuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser && authInitialized,
    isLoading: isLoading || authActionsLoading || !authInitialized,
    login: handleLogin,
    logout: handleLogout,
    hasPermission,
    updateAuthState,
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
