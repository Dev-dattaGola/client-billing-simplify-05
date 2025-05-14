
import React, { useEffect, useState, useCallback, memo } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Memoize DashboardContent to prevent unnecessary re-renders
const DashboardContent = memo(({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <DashboardOverview />
    </div>
  );
});

DashboardContent.displayName = "DashboardContent";

const Dashboard: React.FC = () => {
  // Initialize with true to show loader initially
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isAuthenticated } = useAuth();
  
  // Fixed useEffect to prevent re-renders
  useEffect(() => {
    let isMounted = true;
    
    // Using a single timeout to prevent multiple state updates
    const timer = setTimeout(() => {
      if (isMounted) {
        if (isAuthenticated && currentUser) {
          console.log("Dashboard: User authenticated", currentUser?.role);
        } else {
          console.log("Dashboard: Authentication pending...");
        }
        // Always set loading to false after a delay, regardless of auth state
        setIsLoading(false);
      }
    }, 500);
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isAuthenticated, currentUser]);

  return (
    <PageLayout>
      <Helmet>
        <title>Dashboard - LAWerp500</title>
      </Helmet>
      <DashboardContent isLoading={isLoading} />
    </PageLayout>
  );
};

export default React.memo(Dashboard);
