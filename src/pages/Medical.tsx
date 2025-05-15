
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import MedicalDashboard from '@/components/medical/MedicalDashboard';

const Medical: React.FC = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Medical Management - Law EMR</title>
      </Helmet>
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
        <MedicalDashboard />
      </div>
    </PageLayout>
  );
};

export default Medical;
