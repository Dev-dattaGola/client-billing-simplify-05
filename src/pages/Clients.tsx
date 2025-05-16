
import React, { useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/frontend/components/layout/PageLayout';
import ClientManagement from "@/components/client-management/ClientManagement";
import { ClientProvider } from '@/contexts/ClientContext';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Plus, FileDown, Search, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useNavigationTracking } from '@/hooks/use-navigation-tracking';

const Clients = () => {
  const navigate = useNavigate();
  const { goBack } = useNavigationTracking();
  const [searchQuery, setSearchQuery] = useState('');

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
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search clients..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full pl-8 md:w-[200px] lg:w-[300px]"
      />
    </form>
  ), [searchQuery, handleSearch, handleSearchChange]);

  return (
    <PageLayout>
      <Helmet>
        <title>Client Management - LAW ERP 500</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Client Management</h1>
            <p className="text-muted-foreground mt-1">
              View, add, edit and manage all your clients and their cases
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
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </EnhancedButton>
            
            <EnhancedButton 
              variant="outline" 
              size="sm"
              actionFn={handleExportClients}
              loadingText="Exporting..."
              successText="Clients exported successfully"
            >
              <FileDown className="h-4 w-4 mr-1" /> Export
            </EnhancedButton>
            
            <EnhancedButton 
              variant="default" 
              size="sm"
              onClick={handleAddClient}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Client
            </EnhancedButton>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <ClientProvider>
            <ClientManagement />
          </ClientProvider>
        </div>
      </div>
      
      <footer className="px-4 py-6 border-t text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">LYZ Law Firm</span> | Client Management
          </div>
          <div className="text-sm">© 2023 LYZ Law Firm. All rights reserved.</div>
        </div>
      </footer>
    </PageLayout>
  );
};

// Use memo to prevent unnecessary re-renders
export default React.memo(Clients);
