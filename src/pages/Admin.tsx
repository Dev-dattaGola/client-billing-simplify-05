
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { UserProvider } from '@/contexts/UserContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersManagement from '@/components/admin/UsersManagement';
import RolesManagement from '@/components/admin/RolesManagement';
import AuditLogs from '@/components/admin/AuditLogs';
import SystemSettings from '@/components/admin/SystemSettings';
import { Card, CardContent } from "@/components/ui/card";

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState("users");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Save the active tab in localStorage to persist between page refreshes
    localStorage.setItem('adminActiveTab', value);
  };

  // Load the active tab from localStorage when component mounts
  React.useEffect(() => {
    const savedTab = localStorage.getItem('adminActiveTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  return (
    <PageLayout>
      <Helmet>
        <title>Admin Panel - Law EMR</title>
      </Helmet>
      <div className="bg-transparent min-h-screen px-4 py-6">
        <UserProvider>
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Administrator Control Panel</h1>
              <p className="text-white/70">Manage users, permissions and system settings</p>
            </div>
            
            <Card className="card-glass overflow-hidden border-white/20 bg-transparent">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid grid-cols-4 h-14 rounded-none backdrop-blur-lg bg-white/5 border-b border-white/10">
                    <TabsTrigger value="users" className="text-sm md:text-base font-medium text-white">
                      Users & Permissions
                    </TabsTrigger>
                    <TabsTrigger value="roles" className="text-sm md:text-base font-medium text-white">
                      Roles Management
                    </TabsTrigger>
                    <TabsTrigger value="logs" className="text-sm md:text-base font-medium text-white">
                      Audit Logs
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="text-sm md:text-base font-medium text-white">
                      System Settings
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="p-6 backdrop-blur-lg bg-transparent text-white border-t border-white/10">
                    <TabsContent value="users" className="mt-0 p-0 bg-transparent">
                      <UsersManagement />
                    </TabsContent>
                    <TabsContent value="roles" className="mt-0 p-0 bg-transparent">
                      <RolesManagement />
                    </TabsContent>
                    <TabsContent value="logs" className="mt-0 p-0 bg-transparent">
                      <AuditLogs />
                    </TabsContent>
                    <TabsContent value="settings" className="mt-0 p-0 bg-transparent">
                      <SystemSettings />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </UserProvider>
      </div>
    </PageLayout>
  );
};

export default Admin;
