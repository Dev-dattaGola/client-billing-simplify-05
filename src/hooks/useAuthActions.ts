
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
      // Get current user from Supabase
      const { data } = supabase.auth.getSession();
      if (!data) return false;
      
      // Get user role from metadata
      const userRole = data?.session?.user?.user_metadata?.role || 'client';
      
      // Admin has all permissions
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
