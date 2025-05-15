
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import PageLayout from '@/frontend/components/layout/PageLayout';
import ClientManagement from "@/components/client-management/ClientManagement";
import { ClientProvider } from '@/contexts/ClientContext';

const Clients = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Client Management - Lawerp500</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Client Management</h1>
          <p className="text-muted-foreground mt-1">
            View, add, edit and manage all your clients and their cases
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <ClientProvider>
            <Routes>
              <Route index element={<ClientManagement />} />
              <Route path="*" element={<ClientManagement />} />
            </Routes>
          </ClientProvider>
        </div>
      </div>
      
      <footer className="px-4 py-6 border-t text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Lawerp500</span> | Client Management
          </div>
          <div className="text-sm">© 2023 Lawerp500. All rights reserved.</div>
        </div>
      </footer>
    </PageLayout>
  );
};

export default Clients;
