
import React, { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { Loader2 } from 'lucide-react';

// Memoize DashboardContent to prevent unnecessary re-renders
const DashboardContent = React.memo(({ isLoading }: { isLoading: boolean }) => {
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
  // Use ref to track if component is mounted
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = React.useRef(true);
  
  // Use a single effect with cleanup to avoid potential memory leaks
  useEffect(() => {
    // Reset mount status
    mountedRef.current = true;
    
    // Set a timeout for the loading state
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }, 1500);
    
    // Cleanup to prevent memory leaks and stale updates
    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
    };
  }, []); // Empty dependency array - run only on mount

  // Memoize the content to prevent unnecessary re-renders
  const content = useMemo(() => (
    <DashboardContent isLoading={isLoading} />
  ), [isLoading]);

  return (
    <PageLayout>
      <Helmet>
        <title>Dashboard - LAWerp500</title>
      </Helmet>
      {content}
    </PageLayout>
  );
};

export default Dashboard;
