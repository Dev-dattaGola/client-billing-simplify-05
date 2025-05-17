
import PageLayout from "@/components/layout/PageLayout";
import CaseManagement from "@/components/case-management/CaseManagement";

const Cases = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Case Management</h1>
          <p className="text-muted-foreground mt-1">
            View, add, edit and manage all your legal cases
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <CaseManagement />
        </div>
      </div>
      
      <footer className="px-4 py-6 border-t text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">LAWerp500</span> | Case Management
          </div>
          <div className="text-sm">© 2025 LAWerp500. All rights reserved.</div>
        </div>
      </footer>
    </PageLayout>
  );
};

export default Cases;
