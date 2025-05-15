
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LoginCredentials, AuthContextType } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { restoreAuthState, saveAuthData, clearAuthData, checkPermission, getMockUser } from '@/lib/utils/auth-utils';

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
  currentUser: null,
  login: async () => null,
  logout: () => {},
  hasPermission: () => false,
  updateAuthState: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = () => {
      try {
        const { user, isAuthenticated: isAuth } = restoreAuthState();
        setCurrentUser(user);
        setIsAuthenticated(isAuth);
      } catch (error) {
        console.error("Error initializing auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<User | null> => {
    setIsLoading(true);
    console.log("AuthContext login attempt with:", credentials.email);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get mock user for demo
      const user = getMockUser(credentials.email, credentials.password);
      console.log("Mock user result:", user ? "User found" : "User not found");
      
      if (!user) {
        console.error("Login failed: Invalid credentials");
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
        return null;
      }

      // Save authentication data
      saveAuthData(user, credentials.remember || false);
      setCurrentUser(user);
      setIsAuthenticated(true);
      console.log("Auth data saved for user:", user.name);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name || user.email}!`
      });
      
      // Navigate to dashboard or originally requested page
      const origin = location.state?.from?.pathname || '/dashboard';
      console.log("Navigating to:", origin);
      navigate(origin);
      
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    clearAuthData();
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate('/login');
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    try {
      if (!currentUser) return false;
      return checkPermission(currentUser, permission);
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  };

  // Function to manually refresh auth state (useful after profile updates)
  const updateAuthState = () => {
    try {
      const { user, isAuthenticated: isAuth } = restoreAuthState();
      setCurrentUser(user);
      setIsAuthenticated(isAuth);
    } catch (error) {
      console.error("Error updating auth state:", error);
    }
  };

  const value: AuthContextType = {
    isLoading,
    isAuthenticated,
    currentUser,
    login,
    logout,
    hasPermission,
    updateAuthState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
