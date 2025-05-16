
import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Use callback to prevent unnecessary re-renders
  const initDashboard = useCallback(() => {
    console.log("Dashboard: Initializing");
    if (isAuthenticated && currentUser) {
      console.log("Dashboard: User authenticated", currentUser);
      setIsLoading(false);
    } else {
      console.log("Dashboard: Authentication status:", isAuthenticated);
      setTimeout(() => setIsLoading(false), 500); // Safety timeout
    }
  }, [isAuthenticated, currentUser]);
  
  useEffect(() => {
    initDashboard();
  }, [initDashboard]);

  // Just to verify the component is mounting
  useEffect(() => {
    console.log("Dashboard component mounted");
    return () => console.log("Dashboard component unmounted");
  }, []);

  console.log("Dashboard rendering, isLoading:", isLoading);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Helmet>
        <title>
          {currentUser?.role === 'client' 
            ? 'My Case Dashboard - LAW ERP 500' 
            : 'Dashboard - LAW ERP 500'}
        </title>
      </Helmet>
      <div className="space-y-6">
        <DashboardOverview />
      </div>
    </PageLayout>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(Dashboard);
