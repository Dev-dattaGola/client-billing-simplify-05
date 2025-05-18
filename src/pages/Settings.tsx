
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import SettingsDashboard from '@/components/settings/SettingsDashboard';
import { UserProvider } from '@/contexts/UserContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Settings: React.FC = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Settings - Law ERP</title>
      </Helmet>
      <UserProvider>
        <div className="w-full max-w-6xl mx-auto px-4 py-6">
          <Card className="glass-card backdrop-blur-lg border border-white/20 shadow-lg overflow-hidden rounded-xl mb-6">
            <CardHeader className="bg-gradient-to-r from-gray-500/20 to-slate-600/20 pb-8 border-b border-white/10">
              <CardTitle className="flex items-center gap-2 text-2xl text-white">
                System Settings
              </CardTitle>
              <CardDescription className="text-white/70">
                Configure your account, appearance, notifications, and security preferences
              </CardDescription>
            </CardHeader>
          </Card>
          
          <div className="w-full min-h-screen">
            <SettingsDashboard />
          </div>
        </div>
      </UserProvider>
    </PageLayout>
  );
};

export default Settings;
