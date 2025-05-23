
import React, { useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/frontend/components/layout/PageLayout';
import ClientManagement from "@/components/client-management/ClientManagement";
import { ClientProvider } from '@/contexts/client';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Plus, FileDown, Search, RefreshCw } from 'lucide-react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  console.log("Clients page rendering");

  // Memoize handlers to prevent unnecessary re-renders
  const handleExportClients = useCallback(async () => {
    // Simulate export functionality
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Client data exported successfully');
  }, []);

  const handleAddClient = useCallback(() => {
    navigate('/clients/new');
  }, [navigate]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for "${searchQuery}"...`);
    }
  }, [searchQuery]);

  const handleRefresh = useCallback(async () => {
    // Simulate refresh functionality
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success('Client data refreshed');
  }, []);

  // Memoize search input change handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Memoize the search form
  const searchForm = useMemo(() => (
    <form onSubmit={handleSearch} className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
      <Input
        type="search"
        placeholder="Search clients..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full pl-8 md:w-[200px] lg:w-[300px] bg-white/10 text-white border-white/20"
      />
    </form>
  ), [searchQuery, handleSearch, handleSearchChange]);

  return (
    <PageLayout>
      <Helmet>
        <title>Client Management - LAW ERP 500</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <Card className="glass-card backdrop-blur-lg border border-white/20 shadow-lg overflow-hidden rounded-xl mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 pb-8 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              Client Management System
            </CardTitle>
            <CardDescription className="text-white/70">
              View, add, edit and manage all your clients and their cases
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Client Dashboard</h2>
                <p className="text-white/70 mt-1">
                  Manage client information, cases, and documents
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {searchForm}
                
                <EnhancedButton 
                  variant="outline" 
                  size="sm"
                  actionFn={handleRefresh}
                  loadingText="Refreshing..."
                  successText="Clients refreshed"
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                  type="button"
                >
                  <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                </EnhancedButton>
                
                <EnhancedButton 
                  variant="outline" 
                  size="sm"
                  actionFn={handleExportClients}
                  loadingText="Exporting..."
                  successText="Clients exported successfully"
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                  type="button"
                >
                  <FileDown className="h-4 w-4 mr-1" /> Export
                </EnhancedButton>
                
                <EnhancedButton 
                  variant="default" 
                  size="sm"
                  onClick={handleAddClient}
                  type="button"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Client
                </EnhancedButton>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="max-w-7xl mx-auto">
          <ClientProvider>
            <Routes>
              <Route index element={<ClientManagement />} />
              <Route path="new" element={<ClientManagement />} />
              <Route path="*" element={<Navigate to="/clients" replace />} />
            </Routes>
          </ClientProvider>
        </div>
      </div>
      
      <footer className="px-4 py-6 border-t border-white/20 text-sm text-white/60">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">LYZ Law Firm</span> | Client Management
          </div>
          <div className="text-sm">© 2023 LYZ Law Firm. All rights reserved.</div>
        </div>
      </footer>
    </PageLayout>
  );
};

// Use memo to prevent unnecessary re-renders
export default React.memo(Clients);
