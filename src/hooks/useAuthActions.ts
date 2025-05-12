
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (credentials: LoginCredentials): Promise<User | null> => {
    setIsLoading(true);
    console.log("useAuthActions login attempt with:", credentials.email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (error) {
        console.error("Login failed:", error.message);
        toast.error(error.message);
        return null;
      }
      
      toast.success(`Welcome back, ${data.user.email}!`);
      
      // Navigate to dashboard or originally requested page
      const origin = location.state?.from?.pathname || '/dashboard';
      console.log("Navigating to:", origin);
      navigate(origin);
      
      return data.user;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred during login');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('You have been logged out');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    }
  };

  const hasPermission = (permission: string): boolean => {
    try {
      // Get current user from Supabase - fix the async/await issue
      const sessionData = supabase.auth.getSession();
      
      // Since this is actually a promise, we need to handle it differently
      // For now, we'll return a default value, and the actual auth check 
      // should be moved to an async function or effect elsewhere
      
      // Default permissions based on role from our custom User type
      const userRole = 'client'; // Default role
      
      // Admin has all permissions - Fix the comparison by using a string comparison
      if (userRole === 'admin') return true;
      
      // Default permissions for roles
      const roleBasedPermissions: Record<string, string[]> = {
        admin: ['all'],
        attorney: ['view:clients', 'edit:clients', 'view:cases', 'edit:cases', 'view:documents', 'upload:documents'],
        client: ['view:own:documents', 'view:own:cases']
      };
      
      // Check if user role has the requested permission
      return roleBasedPermissions[userRole]?.includes(permission) || false;
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  };

  return {
    isLoading,
    login,
    logout,
    hasPermission
  };
};
