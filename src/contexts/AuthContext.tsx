
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the shape of our auth context
interface AuthContextProps {
  currentUser: User | null;
  session: Session | null;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Function to update auth state from Supabase session
  const updateAuthState = async () => {
    console.log('Updating auth state from Supabase...');
    setIsLoading(true);
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        setSession(currentSession);
        setCurrentUser(currentSession.user);
        setIsAuthenticated(true);
        
        console.log('Auth state updated from Supabase session:', { 
          isAuthenticated: true, 
          userExists: !!currentSession.user,
          userId: currentSession.user?.id,
          userEmail: currentSession.user?.email
        });
      } else {
        setSession(null);
        setCurrentUser(null);
        setIsAuthenticated(false);
        console.log('No active Supabase session found');
      }
    } catch (error) {
      console.error('Error updating auth state from Supabase:', error);
      setCurrentUser(null);
      setSession(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state on component mount
  useEffect(() => {
    console.log('AuthProvider initialized');
    
    // First, check for existing session
    updateAuthState().then(() => {
      // Then set up the auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          console.log('Auth state changed:', event, !!newSession);
          setSession(newSession);
          setCurrentUser(newSession?.user ?? null);
          setIsAuthenticated(!!newSession);
        }
      );

      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    });
  }, []);

  // Login function
  const login = async (credentials: { email: string; password: string; remember?: boolean }): Promise<User | null> => {
    setIsLoading(true);
    console.log("Logging in with:", credentials.email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (error) {
        console.error("Login failed:", error.message);
        toast(error.message, { 
          description: "Please check your credentials and try again.", 
          duration: 5000 
        });
        return null;
      }
      
      console.log("Login successful");
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      toast("Authentication failed", {
        description: error.message || "Please try again later.",
        duration: 5000
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setSession(null);
      setIsAuthenticated(false);
      toast("Logged out successfully", {
        description: "You have been signed out.",
        duration: 3000
      });
      // Force navigation to login page
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast("Logout error", {
        description: "There was a problem signing you out. Please try again.",
        duration: 5000
      });
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    // Default permissions for roles
    const roleBasedPermissions: Record<string, string[]> = {
      admin: ['all', 'view:clients', 'edit:clients', 'view:attorneys', 'edit:attorneys', 'view:cases', 'edit:cases'],
      attorney: ['view:clients', 'edit:clients', 'view:cases', 'edit:cases', 'view:documents', 'upload:documents'],
      client: ['view:own:documents', 'view:own:cases']
    };

    try {
      if (!currentUser) return false;
      
      // Get user role from metadata
      const userRole = currentUser.user_metadata?.role || 'client';
      
      // Admin has all permissions
      if (userRole === 'admin') return true;
      
      // Check if user role has the requested permission
      return roleBasedPermissions[userRole]?.includes(permission) || false;
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      session,
      setCurrentUser,
      isAuthenticated,
      isLoading,
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
