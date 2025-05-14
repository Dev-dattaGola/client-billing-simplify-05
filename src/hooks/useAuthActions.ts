
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { User, LoginCredentials } from '@/types/auth';
import { 
  getMockUser, 
  saveAuthData, 
  clearAuthData, 
  checkPermission
} from '@/lib/utils/auth-utils';

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (credentials: LoginCredentials): Promise<User | null> => {
    setIsLoading(true);
    console.log("useAuthActions login attempt with:", credentials.email);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get mock user for demo
      const user = getMockUser(credentials.email, credentials.password);
      console.log("Mock user result:", user ? "User found" : "User not found");
      
      if (!user) {
        console.error("Login failed: Invalid credentials");
        toast.error('Invalid email or password');
        return null;
      }

      // Save authentication data
      saveAuthData(user, credentials.remember || false);
      console.log("Auth data saved for user:", user.name);
      
      toast.success(`Welcome back, ${user.name}!`);
      
      // Navigate to dashboard or originally requested page
      const origin = location.state?.from?.pathname || '/dashboard';
      console.log("Navigating to:", origin);
      navigate(origin);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    toast.success('You have been logged out');
    navigate('/login');
  };

  const hasPermission = (permission: string): boolean => {
    try {
      const userDataStr = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      if (!userDataStr) return false;
      
      const userData = JSON.parse(userDataStr);
      return checkPermission(userData, permission);
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
