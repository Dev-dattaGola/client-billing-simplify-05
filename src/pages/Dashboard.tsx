
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Simple initialization check
    const checkAuth = () => {
      if (isAuthenticated && currentUser) {
        console.log("Dashboard: User authenticated", currentUser);
        setIsLoading(false);
      } else {
        console.log("Dashboard: Authentication status:", isAuthenticated);
        // Use a timeout to avoid immediate state changes
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
      }
    };
    
    checkAuth();
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    // Just to verify the component is mounting
    console.log("Dashboard component mounted");
    return () => console.log("Dashboard component unmounted");
  }, []);

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
        <title>Dashboard - LAWerp500</title>
      </Helmet>
      <div className="space-y-6">
        <DashboardOverview />
      </div>
    </PageLayout>
  );
};

export default Dashboard;
