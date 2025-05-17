
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from '@/components/layout/PageLayout';
import { Building2, Users, Shield, PieChart, Activity, Settings } from 'lucide-react';
import FirmManagement from '@/components/super-admin/FirmManagement';
import AdminManagement from '@/components/super-admin/AdminManagement';
import ActivityLogs from '@/components/super-admin/ActivityLogs';
import SystemSettings from '@/components/super-admin/SystemSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('firms');

  return (
    <PageLayout>
      <Helmet>
        <title>Super Admin - LAW ERP 500</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Super Admin Dashboard</h1>
          <p className="text-white/70">
            Manage law firms, administrators, and system settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Firms
              </CardTitle>
              <Building2 className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-white/70">
                +0% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Attorneys
              </CardTitle>
              <Users className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-white/70">
                +0% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clients
              </CardTitle>
              <Users className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-white/70">
                +0% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Health
              </CardTitle>
              <Shield className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Good</div>
              <p className="text-xs text-white/70">
                All services running
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-white/5 backdrop-blur-lg">
            <TabsTrigger value="firms" className="flex items-center gap-2 text-white">
              <Building2 className="h-4 w-4" /> Firms
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center gap-2 text-white">
              <Users className="h-4 w-4" /> Firm Admins
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2 text-white">
              <Activity className="h-4 w-4" /> Activity Logs
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 text-white">
              <Settings className="h-4 w-4" /> System Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="firms" className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-lg p-6 mt-6 text-white">
            <FirmManagement />
          </TabsContent>
          
          <TabsContent value="admins" className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-lg p-6 mt-6 text-white">
            <AdminManagement />
          </TabsContent>
          
          <TabsContent value="activity" className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-lg p-6 mt-6 text-white">
            <ActivityLogs />
          </TabsContent>
          
          <TabsContent value="settings" className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-lg p-6 mt-6 text-white">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="px-4 py-6 border-t border-white/10 text-sm text-white/50 mt-8">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">LAW ERP 500</span> | Super Admin Panel
          </div>
          <div className="text-sm">© 2023-2025 All rights reserved.</div>
        </div>
      </footer>
    </PageLayout>
  );
};

export default SuperAdminDashboard;
