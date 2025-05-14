
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import FileManagement from '@/components/file-management/FileManagement';

const Files: React.FC = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>File Management - LAW ERP 500</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">File Management</h2>
            <p className="text-muted-foreground">
              Manage and organize your case files and documents
            </p>
          </div>
        </div>
        <div className="border-b pb-5"></div>
        <div>
          <FileManagement />
        </div>
      </div>
    </PageLayout>
  );
};

export default Files;
