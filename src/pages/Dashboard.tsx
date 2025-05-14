
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
    // Simple initialization check with a shorter timeout
    if (isAuthenticated && currentUser) {
      console.log("Dashboard: User authenticated", currentUser?.role);
      setIsLoading(false);
    } else {
      console.log("Dashboard: Authentication pending...");
      // Reduced timeout for faster feedback
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer); // Clean up timer
    }
  }, [isAuthenticated, currentUser]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
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
      <div className="space-y-6 p-6">
        <DashboardOverview />
      </div>
    </PageLayout>
  );
};

export default Dashboard;
