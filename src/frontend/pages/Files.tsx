
import PageLayout from "@/frontend/components/layout/PageLayout";
import FileManagement from "@/components/file-management/FileManagement";

const Files = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Files Management</h1>
          <p className="text-muted-foreground mt-1">
            Access the Master Dependency View to see all documents across clients and cases
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <FileManagement />
        </div>
      </div>
      
      <footer className="px-4 py-6 border-t text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">LAWerp500</span> | Files Management
          </div>
          <div className="text-sm">© 2025 LAWerp500. All rights reserved.</div>
        </div>
      </footer>
    </PageLayout>
  );
};

export default Files;
