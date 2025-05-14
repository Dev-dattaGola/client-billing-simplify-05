
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/auth';
import { useAuthActions } from '@/hooks/useAuthActions';
import { restoreAuthState } from '@/lib/utils/auth-utils';

// Define the shape of our auth context
interface AuthContextProps {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string; remember?: boolean }) => Promise<User | null>;
  logout: () => void;
  updateAuthState: () => void;
  hasPermission: (permission: string) => boolean;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { login, logout: logoutAction, hasPermission, isLoading: actionLoading } = useAuthActions();
  const navigate = useNavigate();

  // Function to update auth state based on stored tokens
  const updateAuthState = () => {
    console.log('Updating auth state...');
    try {
      const { user, isAuthenticated: authStatus } = restoreAuthState();
      setCurrentUser(user);
      setIsAuthenticated(authStatus);
      console.log('Auth state updated:', { 
        isAuthenticated: authStatus, 
        userExists: !!user,
        userName: user?.name,
        userRole: user?.role
      });
    } catch (error) {
      console.error('Error updating auth state:', error);
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  // Initialize auth state on component mount
  useEffect(() => {
    console.log('AuthProvider initialized');
    updateAuthState();
    setIsLoading(false);
  }, []);

  // Custom logout function that handles navigation after logout
  const logout = () => {
    logoutAction();
    setCurrentUser(null);
    setIsAuthenticated(false);
    // Force navigation to login page
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      isAuthenticated,
      isLoading: isLoading || actionLoading,
      login,
      logout,
      updateAuthState,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
