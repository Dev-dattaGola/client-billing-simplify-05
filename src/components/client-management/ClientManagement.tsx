import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
import { Search, Download, FileText, AlertTriangle, UserPlus, RepeatIcon, UserX } from 'lucide-react';
import ClientMedicalRecords from "./ClientMedicalRecords";
import ClientDocuments from "./ClientDocuments";
import ClientAppointments from "./ClientAppointments";
import ClientCommunication from "./ClientCommunication";
import ClientCaseReport from "./ClientCaseReport";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import RoleBasedLayout from "../layout/RoleBasedLayout";
import { Client } from "@/types/client";

const ClientManagement = () => {
  const { 
    clients,
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
    handleViewClient,
    startEditClient,
    clearClientToEdit,
    transferClient,
    dropClient
  } = useClient();
  
  const { hasPermission, currentUser } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDropClientModalOpen, setIsDropClientModalOpen] = useState(false);
  const [selectedAttorneyForTransfer, setSelectedAttorneyForTransfer] = useState("");
  const [dropReason, setDropReason] = useState("");
  const { toast } = useToast();

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleDownloadCaseSummary = () => {
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
  };
  
  // Handle client transfer function - fix type error by passing the client object instead of just ID
  const handleTransferClient = () => {
    if (!selectedClient || !selectedAttorneyForTransfer) return;
    
    // Get attorney name based on ID (in real app, would fetch from API)
    const getAttorneyName = (id: string) => {
      switch (id) {
        case "attorney1": return "John Doe";
        case "attorney2": return "Jane Smith";
        case "attorney3": return "Michael Johnson";
        default: return "Unknown Attorney";
      }
    };
    
    const attorneyName = getAttorneyName(selectedAttorneyForTransfer);
    
    // Pass the entire client object instead of just the ID
    transferClient(selectedClient, selectedAttorneyForTransfer, attorneyName);
    setIsTransferModalOpen(false);
    setSelectedAttorneyForTransfer("");
    
    toast({
      title: "Client Transferred",
      description: `The client has been successfully transferred to ${attorneyName}.`,
    });
  };
  
  // Handle drop client function - fix type error by passing the client object instead of just ID
  const handleDropClient = () => {
    if (!selectedClient || !dropReason) return;
    
    // Pass the entire client object instead of just the ID
    dropClient(selectedClient, dropReason);
    setIsDropClientModalOpen(false);
    setDropReason("");
    setActiveTab("view");
    
    toast({
      title: "Client Dropped",
      description: "The client has been successfully dropped from the firm.",
    });
  };

  const renderDetailsContent = () => {
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
            
            {/* New Admin-only buttons for client management */}
            <RoleBasedLayout requiredRoles={['admin']}>
              <Button 
                variant="outline" 
                onClick={() => setIsTransferModalOpen(true)} 
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                <RepeatIcon className="h-4 w-4" />
                <span>Transfer Client</span>
              </Button>
            </RoleBasedLayout>
            
            <RoleBasedLayout requiredRoles={['admin']}>
              <Button 
                variant="outline" 
                onClick={() => setIsDropClientModalOpen(true)} 
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
              >
                <UserX className="h-4 w-4" />
                <span>Drop Client</span>
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
        
        <TabsContent value="view" className="p-6 space-y-4">
          <ClientList 
            clients={clients} 
            onEditClient={(client) => hasPermission('edit:clients') ? startEditClient(client) : null}
            onViewClient={handleViewClient}
            onDeleteClient={(client) => hasPermission('edit:clients') ? handleDeleteClient(client) : null}
            loading={loading}
          />
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

      {/* Client Search Sheet */}
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
              onDeleteClient={(client) => hasPermission('edit:clients') ? handleDeleteClient(client) : null}
              loading={loading}
            />
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Transfer Client Modal */}
      <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Client</DialogTitle>
            <DialogDescription>
              Select an attorney to transfer this client to.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="attorney">Select Attorney</Label>
            <Select
              value={selectedAttorneyForTransfer}
              onValueChange={setSelectedAttorneyForTransfer}
            >
              <SelectTrigger id="attorney">
                <SelectValue placeholder="Select an attorney" />
              </SelectTrigger>
              <SelectContent>
                {/* This would be dynamically populated with attorneys from your system */}
                <SelectItem value="attorney1">John Doe</SelectItem>
                <SelectItem value="attorney2">Jane Smith</SelectItem>
                <SelectItem value="attorney3">Michael Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransferClient} disabled={!selectedAttorneyForTransfer}>
              Transfer Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Drop Client Modal */}
      <Dialog open={isDropClientModalOpen} onOpenChange={setIsDropClientModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Drop Client</DialogTitle>
            <DialogDescription>
              Please provide a reason for dropping this client. This will be recorded for future reference.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="dropReason">Reason for Dropping</Label>
            <Textarea
              id="dropReason"
              value={dropReason}
              onChange={(e) => setDropReason(e.target.value)}
              placeholder="Please provide a detailed reason..."
              className="h-32"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDropClientModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDropClient} 
              disabled={!dropReason}
              variant="destructive"
            >
              Drop Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManagement;
