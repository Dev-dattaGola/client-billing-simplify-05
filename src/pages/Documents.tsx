
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
    </PageLayout>
  );
};

export default Documents;
