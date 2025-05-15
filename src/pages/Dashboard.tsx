
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import RoleBasedLayout from '@/components/layout/RoleBasedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import role-specific dashboards based on user role
const ClientDashboard = React.lazy(() => import('@/components/dashboard/ClientDashboard'));
const AttorneyDashboard = React.lazy(() => import('@/components/dashboard/AttorneyDashboard'));
const AdminDashboard = React.lazy(() => import('@/components/dashboard/AdminDashboard'));

const Dashboard: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();

  // Choose dashboard component based on user role
  const getDashboardForRole = () => {
    if (!currentUser) return <DefaultDashboard />;
    
    switch (currentUser.role) {
      case 'superadmin':
      case 'admin':
        return <AdminDashboard />;
      case 'attorney':
        return <AttorneyDashboard />;
      case 'client':
        return <ClientDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Dashboard | LYZ Law Firm</title>
      </Helmet>
      
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {isAuthenticated ? (
          getDashboardForRole()
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Please log in</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You need to log in to view your dashboard.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

// Fallback dashboard for users without a specific role
const DefaultDashboard: React.FC = () => {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to LYZ Law Firm</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your personal dashboard. Contact your administrator if you need help.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
