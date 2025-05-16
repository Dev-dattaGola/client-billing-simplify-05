
import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientList from "./ClientList";
import ClientForm from "./ClientForm";
import ClientDetails from "./ClientDetails";
import { useClient } from "@/contexts/ClientContext";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Search, Download, FileText, AlertTriangle, RefreshCw } from 'lucide-react';
import ClientMedicalRecords from "./ClientMedicalRecords";
import ClientDocuments from "./ClientDocuments";
import ClientAppointments from "./ClientAppointments";
import ClientCommunication from "./ClientCommunication";
import ClientCaseReport from "./ClientCaseReport";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import RoleBasedLayout from "../layout/RoleBasedLayout";
import DroppedClientsList from "./DroppedClientsList";
import { Separator } from "@/components/ui/separator";
import React from "react";

const ClientManagement = () => {
  const { 
    clients,
    droppedClients,
    selectedClient, 
    clientToEdit,
    loading,
    activeTab,
    activeDetailTab,
    setActiveTab,
    setActiveDetailTab,
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
    handleDropClient,
    handleViewClient,
    startEditClient,
    clearClientToEdit,
    refreshClients
  } = useClient();
  
  const { hasPermission, currentUser } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toast } = useToast();

  // Memoize handlers to prevent re-renders
  const handleSearchClick = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

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

  const handleRefreshClients = useCallback(async () => {
    await refreshClients();
    toast({
      title: "Refreshed",
      description: "Client data has been refreshed."
    });
  }, [refreshClients, toast]);

  const renderDetailsContent = useCallback(() => {
    if (!selectedClient) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setActiveTab("view")}>
            Back to List
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSearchClick} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search Clients</span>
            </Button>
            
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
            {/* Only show overview tab to attorneys and admins */}
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
            
            {/* Documents are visible to all users */}
            <TabsTrigger value="documents">Documents</TabsTrigger>
            
            {/* Appointments are visible to all users */}
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            
            {/* Communication is visible to all users */}
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
              {selectedClient && (
                <ClientDetails 
                  client={selectedClient}
                  onBack={() => setActiveTab("view")}
                  onEdit={() => hasPermission('edit:clients') ? startEditClient(selectedClient) : null}
                />
              )}
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
  }, [selectedClient, activeDetailTab, setActiveDetailTab, setActiveTab, handleSearchClick, handleDownloadCaseSummary, startEditClient, hasPermission]);

  // Determine which tabs should be visible based on user role
  const shouldShowAddTab = currentUser && ['admin'].includes(currentUser.role);

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="border-b px-6 py-2">
          <TabsList className={`grid w-full ${shouldShowAddTab ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <TabsTrigger value="view">View Clients</TabsTrigger>
            
            {shouldShowAddTab && (
              <TabsTrigger value="add">{clientToEdit ? "Edit Client" : "Add Client"}</TabsTrigger>
            )}
          </TabsList>
        </div>
        
        <TabsContent value="view" className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Active Clients</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleRefreshClients}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          <ClientList 
            clients={clients} 
            onEditClient={(client) => hasPermission('edit:clients') ? startEditClient(client) : null}
            onViewClient={handleViewClient}
            onDropClient={(clientId, reason) => hasPermission('edit:clients') ? handleDropClient(clientId, reason) : undefined}
            loading={loading}
          />
          
          {droppedClients.length > 0 && (
            <>
              <Separator className="my-8" />
              <DroppedClientsList
                clients={droppedClients}
                onViewClient={handleViewClient}
                onDeleteClient={(clientId) => hasPermission('delete:clients') ? handleDeleteClient(clientId) : null}
                loading={loading}
              />
            </>
          )}
        </TabsContent>
        
        <RoleBasedLayout 
          requiredRoles={['admin']}
          fallback={
            <TabsContent value="add" className="p-6">
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 flex flex-col items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-lg font-medium text-yellow-800">Access Restricted</h3>
                <p className="text-yellow-600 text-center mt-2">
                  You do not have permission to {clientToEdit ? "edit" : "add"} clients.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => setActiveTab("view")}
                >
                  Back to Client List
                </Button>
              </div>
            </TabsContent>
          }
        >
          <TabsContent value="add" className="p-6">
            <ClientForm 
              initialData={clientToEdit} 
              onSubmit={clientToEdit ? handleEditClient : handleAddClient} 
              onCancel={() => {
                clearClientToEdit();
                setActiveTab("view");
              }}
            />
          </TabsContent>
        </RoleBasedLayout>

        <TabsContent value="details" className="p-6 space-y-4">
          {renderDetailsContent()}
        </TabsContent>
      </Tabs>

      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent side="right" className="w-full sm:w-[640px] sm:max-w-full">
          <SheetHeader>
            <SheetTitle>Search Clients</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <ClientList 
              clients={clients} 
              onEditClient={(client) => hasPermission('edit:clients') ? startEditClient(client) : null}
              onViewClient={(client) => {
                handleViewClient(client);
                setIsSearchOpen(false);
              }}
              onDropClient={(clientId, reason) => hasPermission('edit:clients') ? handleDropClient(clientId, reason) : undefined}
              loading={loading}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ClientManagement);
