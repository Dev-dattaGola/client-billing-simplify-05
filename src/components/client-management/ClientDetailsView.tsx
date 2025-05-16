
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, FileText } from 'lucide-react';
import { useClient } from "@/contexts/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import RoleBasedLayout from "../layout/RoleBasedLayout";
import ClientDetails from "./ClientDetails";
import ClientMedicalRecords from "./ClientMedicalRecords";
import ClientDocuments from "./ClientDocuments";
import ClientAppointments from "./ClientAppointments";
import ClientCommunication from "./ClientCommunication";
import ClientCaseReport from "./ClientCaseReport";

interface ClientDetailsViewProps {
  onSearchClick?: () => void;
}

const ClientDetailsView: React.FC<ClientDetailsViewProps> = ({ onSearchClick }) => {
  const { 
    selectedClient, 
    activeDetailTab,
    setActiveDetailTab,
    setActiveTab,
    startEditClient
  } = useClient();
  
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  const handleDownloadCaseSummary = useCallback(() => {
    if (!selectedClient) return;
    
    toast({
      title: "Generating Case Summary",
      description: "Your comprehensive case summary is being prepared...",
    });
    
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Complete case summary has been downloaded successfully.",
      });
    }, 2000);
  }, [selectedClient, toast]);

  if (!selectedClient) return null;

  console.log("ClientDetailsView rendering, active tab:", activeDetailTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => setActiveTab("view")}>
          Back to List
        </Button>
        <div className="flex gap-2">
          {onSearchClick && (
            <Button variant="outline" onClick={onSearchClick} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search Clients</span>
            </Button>
          )}
          
          <RoleBasedLayout requiredRoles={['admin', 'attorney']}>
            <Button variant="outline" onClick={handleDownloadCaseSummary} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Download Summary</span>
            </Button>
          </RoleBasedLayout>
          
          <RoleBasedLayout requiredRoles={['admin', 'attorney']}>
            <Button onClick={() => startEditClient(selectedClient)} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Edit Client</span>
            </Button>
          </RoleBasedLayout>
        </div>
      </div>

      <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab}>
        <TabsList className="grid grid-cols-6 gap-2 w-full">
          <RoleBasedLayout 
            requiredRoles={['admin', 'attorney']}
            fallback={null}
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </RoleBasedLayout>
          
          <RoleBasedLayout 
            requiredRoles={['admin', 'attorney']}
            fallback={null}
          >
            <TabsTrigger value="medical">Medical Records</TabsTrigger>
          </RoleBasedLayout>
          
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          
          <RoleBasedLayout 
            requiredRoles={['admin', 'attorney']}
            fallback={null}
          >
            <TabsTrigger value="case-report">Case Report</TabsTrigger>
          </RoleBasedLayout>
        </TabsList>
        
        <RoleBasedLayout requiredRoles={['admin', 'attorney']}>
          <TabsContent value="overview">
            <ClientDetails 
              client={selectedClient}
              onBack={() => setActiveTab("view")}
              onEdit={() => hasPermission('edit:clients') ? startEditClient(selectedClient) : null}
            />
          </TabsContent>
        </RoleBasedLayout>
        
        <RoleBasedLayout requiredRoles={['admin', 'attorney']}>
          <TabsContent value="medical">
            <ClientMedicalRecords clientId={selectedClient.id} />
          </TabsContent>
        </RoleBasedLayout>
        
        <TabsContent value="documents">
          <ClientDocuments clientId={selectedClient.id} />
        </TabsContent>
        
        <TabsContent value="appointments">
          <ClientAppointments clientId={selectedClient.id} />
        </TabsContent>
        
        <TabsContent value="communication">
          <ClientCommunication clientId={selectedClient.id} />
        </TabsContent>
        
        <RoleBasedLayout requiredRoles={['admin', 'attorney']}>
          <TabsContent value="case-report">
            <ClientCaseReport clientId={selectedClient.id} />
          </TabsContent>
        </RoleBasedLayout>
      </Tabs>
    </div>
  );
};

export default React.memo(ClientDetailsView);
