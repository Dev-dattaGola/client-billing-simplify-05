
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import SettingsDashboard from '@/components/settings/SettingsDashboard';
import { UserProvider } from '@/contexts/UserContext';

const Settings: React.FC = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Settings - Law ERP</title>
      </Helmet>
      <UserProvider>
        <div className="w-full max-w-6xl mx-auto min-h-screen">
          <SettingsDashboard />
        </div>
      </UserProvider>
    </PageLayout>
  );
};

export default Settings;

