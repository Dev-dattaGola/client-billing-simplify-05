
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { Loader2 } from 'lucide-react';

// Separate loading component to reduce re-renders
const LoadingState = () => (
  <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
    <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
    <span className="ml-2">Loading dashboard...</span>
  </div>
);

// Separate content component to reduce re-renders
const DashboardContent = React.memo(() => (
  <div className="space-y-6 p-6">
    <DashboardOverview />
  </div>
));
DashboardContent.displayName = "DashboardContent";

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simple loading effect with cleanup
  useEffect(() => {
    let mounted = true;
    
    const timer = setTimeout(() => {
      if (mounted) {
        setIsLoading(false);
      }
    }, 1000);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);
  
  // Use component conditionally rather than conditionally rendering JSX
  const content = isLoading ? <LoadingState /> : <DashboardContent />;

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
