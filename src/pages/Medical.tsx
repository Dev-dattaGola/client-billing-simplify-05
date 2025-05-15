
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import MedicalDashboard from '@/components/medical/MedicalDashboard';
import AdminMedicalView from '@/components/admin/medical/AdminMedicalView';
import { useAuth } from '@/contexts/AuthContext';

const Medical: React.FC = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <PageLayout>
      <Helmet>
        <title>Medical Records - Law EMR</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Medical Records Management</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? "Review all medical records and providers entered by attorneys" 
              : "Manage patient medical records, providers, and insurance information"}
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          {isAdmin ? <AdminMedicalView /> : <MedicalDashboard />}
        </div>
      </div>
      
      <footer className="px-4 py-6 border-t text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">LYZ Law Firm</span> | Medical Records Management
          </div>
          <div className="text-sm">© 2023-2025 LYZ Law Firm. All rights reserved.</div>
        </div>
      </footer>
    </PageLayout>
  );
};

export default Medical;
