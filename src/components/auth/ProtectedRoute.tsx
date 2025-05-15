
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/common/LoadingScreen';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles = [] }) => {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // User is not authenticated
      toast.error("Please log in to access this page.", {
        id: "auth-required",
        description: "Authentication Required"
      });
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!isLoading && isAuthenticated && currentUser && roles.length > 0) {
      // Check if the user has the required role
      if (!roles.includes(currentUser.role)) {
        toast.error("You don't have permission to access this page.", {
          id: "permission-denied",
          description: "Permission Denied"
        });
        navigate('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, currentUser, roles, navigate, location]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // If authentication check is complete and user is authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
