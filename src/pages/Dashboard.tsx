
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
  
  // Use useCallback to prevent function recreation on every render
  const initializeDashboard = useCallback(() => {
    if (isAuthenticated && currentUser) {
      console.log("Dashboard: User authenticated", currentUser?.role);
      setIsLoading(false);
    } else {
      console.log("Dashboard: Authentication pending...");
      // Don't call setIsLoading here - we'll do it after a timeout
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    // Using a single timeout to prevent multiple state updates
    const timer = setTimeout(() => {
      initializeDashboard();
      // Ensure we set loading to false even if auth is still pending
      // This prevents us getting stuck in a loading state
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [initializeDashboard]);

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
