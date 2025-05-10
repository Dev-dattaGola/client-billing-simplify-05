
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { useAuthActions } from '@/hooks/useAuthActions';
import { restoreAuthState } from '@/lib/utils/auth-utils';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { login, logout, hasPermission: checkPermission, isLoading: actionLoading } = useAuthActions();

  // Enhanced Authentication Management
  const updateAuthState = () => {
    console.log("Updating auth state...");
    try {
      const { user, isAuthenticated: isAuth } = restoreAuthState();
      
      console.log("Auth state updated:", { 
        isAuthenticated: isAuth, 
        userExists: !!user,
        userName: user?.name,
        userRole: user?.role 
      });
      
      setCurrentUser(user);
      setIsAuthenticated(isAuth);
    } catch (error) {
      console.error("Error updating auth state:", error);
      // If there's an error, clear any potentially corrupt data
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("AuthProvider initialized");
    updateAuthState();
    
    // Check auth state when window becomes visible again
    // This helps when user switches tabs and comes back
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateAuthState();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Combine loading states
  const combinedIsLoading = isLoading || actionLoading;

  return (
    <AuthContext.Provider
      value={{
        isLoading: combinedIsLoading,
        isAuthenticated,
        currentUser,
        login,
        logout,
        hasPermission: checkPermission,
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
