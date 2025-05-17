
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import MessagingDashboard from '@/components/messaging/MessagingDashboard';

const Messages: React.FC = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Messaging - Law EMR</title>
      </Helmet>
      <div className="min-h-screen">
        <MessagingDashboard />
      </div>
    </PageLayout>
  );
};

export default Messages;
