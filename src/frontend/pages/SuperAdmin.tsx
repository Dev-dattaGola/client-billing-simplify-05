
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from '@/components/layout/PageLayout';
import FirmManagement from '@/components/super-admin/FirmManagement';
import AdminManagement from '@/components/super-admin/AdminManagement';
import SystemSettings from '@/components/super-admin/SystemSettings';
import ActivityLogs from '@/components/super-admin/ActivityLogs';

const SuperAdmin = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Super Admin - LAW ERP 500</title>
      </Helmet>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            System-wide administration and management
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border">
          <Tabs defaultValue="firms" className="p-6">
            <TabsList className="mb-4">
              <TabsTrigger value="firms">Law Firms</TabsTrigger>
              <TabsTrigger value="admins">Admin Users</TabsTrigger>
              <TabsTrigger value="system">System Settings</TabsTrigger>
              <TabsTrigger value="logs">Activity Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="firms">
              <FirmManagement />
            </TabsContent>
            
            <TabsContent value="admins">
              <AdminManagement />
            </TabsContent>
            
            <TabsContent value="system">
              <SystemSettings />
            </TabsContent>
            
            <TabsContent value="logs">
              <ActivityLogs />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default SuperAdmin;
