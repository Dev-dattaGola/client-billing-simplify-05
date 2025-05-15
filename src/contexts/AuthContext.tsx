import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType, LoginCredentials } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setCurrentUser(newSession?.user ?? null);
        
        // If session changed, fetch user role
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserRole(newSession.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setCurrentUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        fetchUserRole(initialSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user role from profiles table
  async function fetchUserRole(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      if (data) {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
    }
  }

  // Login function
  async function login({ email, password, remember = false }: LoginCredentials) {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      if (data.user) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.user.email || 'user'}!`
        });
        
        // Navigate to dashboard
        navigate('/dashboard');
        
        // Convert Supabase user to our app's User type
        const appUser = {
          id: data.user.id,
          email: data.user.email || '',
          role: userRole || 'client'
        };
        
        return appUser;
      }
      
      return null;
    } catch (error: any) {
      toast({
        title: "Login error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  // Logout function
  async function logout() {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error: any) {
      toast({
        title: "Logout error",
        description: error.message || "An error occurred during logout",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Check if user has a specific permission
  function hasPermission(permission: string) {
    // Superadmin and admin roles have all permissions
    if (userRole === 'superadmin' || userRole === 'admin') {
      return true;
    }

    // Attorney permissions
    if (userRole === 'attorney') {
      const attorneyPermissions = [
        'view:clients', 'edit:clients',
        'view:cases', 'create:cases', 'edit:cases',
        'view:documents', 'upload:documents', 'download:documents',
        'view:calendar', 'create:events', 'edit:events',
        'view:reports'
      ];
      
      return attorneyPermissions.includes(permission);
    }

    // Client permissions
    if (userRole === 'client') {
      const clientPermissions = [
        'view:documents', 'upload:documents', 'download:documents',
        'view:calendar', 'view:appointments',
        'view:messages', 'send:messages'
      ];
      
      return clientPermissions.includes(permission);
    }

    return false;
  }

  // Function to manually refresh auth state (useful after profile updates)
  function updateAuthState() {
    if (currentUser?.id) {
      fetchUserRole(currentUser.id);
    }
  }

  const value: AuthContextType = {
    isLoading,
    isAuthenticated: !!currentUser,
    currentUser: currentUser ? {
      id: currentUser.id,
      email: currentUser.email || '',
      role: userRole || 'client'
    } : null,
    login,
    logout,
    hasPermission,
    updateAuthState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
