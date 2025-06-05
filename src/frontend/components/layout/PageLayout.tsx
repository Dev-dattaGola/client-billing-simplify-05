
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';

// Re-export the main PageLayout for frontend compatibility
const FrontendPageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <PageLayout>{children}</PageLayout>;
};

export default FrontendPageLayout;
