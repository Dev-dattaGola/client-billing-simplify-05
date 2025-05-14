
import PageLayout from "@/components/layout/PageLayout";
import ReportsManagement from "@/components/reports/ReportsManagement";

const Reports = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Reports Management</h1>
          <p className="text-muted-foreground mt-1">
            View, edit and download medical reports and reduction statements
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <ReportsManagement />
        </div>
      </div>
    </PageLayout>
  );
};

export default Reports;
