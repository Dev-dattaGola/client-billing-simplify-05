
import PageLayout from "@/components/layout/PageLayout";
import DocumentsManagement from "@/components/documents/DocumentsManagement";

const Documents = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Documents Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage client documents including LOP, LOR, Insurance records, and Bills
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <DocumentsManagement />
        </div>
      </div>
      
      <footer className="px-4 py-6 border-t text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">LYZ Law Firm</span> | Document Management
          </div>
          <div className="text-sm">© 2023 LYZ Law Firm. All rights reserved.</div>
        </div>
      </footer>
    </PageLayout>
  );
};

export default Documents;
