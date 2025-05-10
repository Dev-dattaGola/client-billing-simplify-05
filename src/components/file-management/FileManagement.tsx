
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DependencyViewSheet from "./DependencyViewSheet";
import { FileMetadata } from "@/lib/services/FileMetadataTypes";

const FileManagement = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const tabFromUrl = urlParams.get('tab') || 'dependency';
  
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Mock file data - in a real app, this would come from your API or database
  const [files, setFiles] = useState<FileMetadata[]>([
    {
      id: "1",
      name: "Client Agreement.pdf",
      size: 2500000,
      type: "application/pdf",
      url: "/documents/client-agreement.pdf",
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      category: "Legal Documents",
      fileType: "pdf",
      uploadedBy: "Admin User",
      uploadedById: "admin-001"
    },
    {
      id: "2",
      name: "Medical Records.pdf",
      size: 5000000,
      type: "application/pdf",
      url: "/documents/medical-records.pdf",
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      category: "Medical Documents",
      fileType: "pdf",
      uploadedBy: "Admin User",
      uploadedById: "admin-001"
    }
  ]);

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(urlParams.get('tab') || 'dependency');
  }, [location.search]);

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="border-b px-6 py-2 overflow-x-auto">
          <TabsList className="grid w-full max-w-md grid-cols-1">
            <TabsTrigger value="dependency" onClick={() => setIsSheetOpen(true)}>
              Master Dependency View
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="dependency" className="p-6 space-y-4">
          <DependencyViewSheet 
            open={isSheetOpen}
            onOpenChange={setIsSheetOpen}
            files={files}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FileManagement;
