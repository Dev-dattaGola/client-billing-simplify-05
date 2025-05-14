
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import CalendarManagement from "@/components/calendar/CalendarManagement";

const Calendar = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Calendar & Tasks - LAW ERP 500</title>
      </Helmet>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Calendar & Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Schedule appointments, manage tasks, and set reminders
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border">
          <CalendarManagement />
        </div>
      </div>
      
      <footer className="px-4 py-6 border-t text-sm text-muted-foreground mt-8">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">LAW ERP 500</span> | Calendar System
          </div>
          <div className="text-sm">© 2023-2025 All rights reserved.</div>
        </div>
      </footer>
    </PageLayout>
  );
};

export default Calendar;
