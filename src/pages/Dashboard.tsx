
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { Loader2 } from 'lucide-react';

// Separate loading component
const LoadingState = () => (
  <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
    <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
    <span className="ml-2">Loading dashboard...</span>
  </div>
);

// Memoized dashboard content to prevent unnecessary re-renders
const DashboardContent = React.memo(() => (
  <div className="space-y-6 p-6">
    <DashboardOverview />
  </div>
));
DashboardContent.displayName = "DashboardContent";

const Dashboard: React.FC = () => {
  // Use a simple loading state with no dependencies to avoid render loops
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Using a cleanup pattern to ensure the effect only runs once
    let isMounted = true;
    
    const timer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 1000);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);
  
  return (
    <PageLayout>
      <Helmet>
        <title>Dashboard - LAWerp500</title>
      </Helmet>
      {isLoading ? <LoadingState /> : <DashboardContent />}
    </PageLayout>
  );
};

export default Dashboard;
