
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { Loader2 } from 'lucide-react';

// Separate loading component with React.memo
const LoadingState = React.memo(() => (
  <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
    <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
    <span className="ml-2">Loading dashboard...</span>
  </div>
));
LoadingState.displayName = "LoadingState";

// Memoized dashboard content
const DashboardContent = React.memo(() => (
  <div className="space-y-6 p-6">
    <DashboardOverview />
  </div>
));
DashboardContent.displayName = "DashboardContent";

const Dashboard: React.FC = () => {
  // Use a simple loading state with a ref to track initialization
  const [isLoading, setIsLoading] = useState(true);
  const isInitialRender = useRef(true);
  
  // Use useEffect with empty dependency array and refs to prevent re-renders
  useEffect(() => {
    // Only run this effect once
    if (isInitialRender.current) {
      isInitialRender.current = false;
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      // Cleanup to avoid memory leaks
      return () => clearTimeout(timer);
    }
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

export default React.memo(Dashboard);
