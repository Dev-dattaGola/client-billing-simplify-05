
import { Helmet } from "react-helmet-async";
import PageLayout from "@/components/layout/PageLayout";
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
    </PageLayout>
  );
};

export default Calendar;
