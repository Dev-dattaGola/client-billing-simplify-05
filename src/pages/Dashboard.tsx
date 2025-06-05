
import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isAuthenticated } = useAuth();
  
  const initDashboard = useCallback(() => {
    if (isAuthenticated && currentUser) {
      setIsLoading(false);
    } else {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [isAuthenticated, currentUser]);
  
  useEffect(() => {
    initDashboard();
  }, [initDashboard]);

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

export default React.memo(Dashboard);
