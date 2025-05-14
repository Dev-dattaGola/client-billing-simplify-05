
import React, { useEffect, useState, memo } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { Loader2 } from 'lucide-react';

// Memoize DashboardContent to prevent unnecessary re-renders
const DashboardContent = memo(({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
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
  
  // Use a single effect to handle loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    // Cleanup function
    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run only once on mount

  return (
    <PageLayout>
      <Helmet>
        <title>Dashboard - LAWerp500</title>
      </Helmet>
      <DashboardContent isLoading={isLoading} />
    </PageLayout>
  );
};

export default memo(Dashboard);
