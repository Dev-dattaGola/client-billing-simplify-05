
import { Helmet } from "react-helmet-async";
import PageLayout from "@/frontend/components/layout/PageLayout";
import CalendarManagement from "@/components/calendar/CalendarManagement";

const Calendar = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Calendar & Tasks - LAW ERP 500</title>
      </Helmet>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Calendar & Tasks</h1>
          <p className="text-white/80 mt-1">
            Schedule appointments, manage tasks, and set reminders
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto glass-effect rounded-lg shadow-sm border border-white/20">
          <CalendarManagement />
        </div>
      </div>
      
      <footer className="px-4 py-6 border-t border-white/10 text-sm text-white/60 mt-8">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white/80">LAW ERP 500</span> | Calendar System
          </div>
          <div className="text-sm">© 2023-2025 All rights reserved.</div>
        </div>
      </footer>
    </PageLayout>
  );
};

export default Calendar;
