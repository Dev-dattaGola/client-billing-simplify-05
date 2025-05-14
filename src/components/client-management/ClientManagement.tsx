
import { useState } from "react";
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
import { Search, Download, FileText, AlertTriangle, UserPlus, UserMinus, UserCheck } from 'lucide-react';
import ClientMedicalRecords from "./ClientMedicalRecords";
import ClientDocuments from "./ClientDocuments";
import ClientAppointments from "./ClientAppointments";
import ClientCommunication from "./ClientCommunication";
import ClientCaseReport from "./ClientCaseReport";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import RoleBasedLayout from "../layout/RoleBasedLayout";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Client } from "@/types/client";

const ClientManagement = () => {
  const { 
    clients,
    selectedClient, 
    clientToEdit,
    loading,
    activeTab,
    activeDetailTab,
    attorneys,
    setActiveTab,
    setActiveDetailTab,
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
    handleViewClient,
    startEditClient,
    clearClientToEdit,
    handleDropClient,
    handleTransferClient,
    loadAttorneys
  } = useClient();
  
  const { hasPermission, currentUser } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropDialogOpen, setIsDropDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [dropReason, setDropReason] = useState('');
  const [selectedAttorneyId, setSelectedAttorneyId] = useState('');
  const [clientToModify, setClientToModify] = useState<Client | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };
  
  const handleAddNewClient = () => {
    clearClientToEdit();
    setActiveTab("add");
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

  const openDropClientDialog = (client: Client) => {
    setClientToModify(client);
    setDropReason('');
    setIsDropDialogOpen(true);
  };

  const openTransferClientDialog = (client: Client) => {
    setClientToModify(client);
    setSelectedAttorneyId('');
    loadAttorneys().then(() => {
      setIsTransferDialogOpen(true);
    });
  };

  const confirmDropClient = async () => {
    if (!clientToModify || !dropReason.trim()) return;
    
    await handleDropClient(clientToModify.id, dropReason);
    setIsDropDialogOpen(false);
    setClientToModify(null);
    setDropReason('');
  };

  const confirmTransferClient = async () => {
    if (!clientToModify || !selectedAttorneyId) return;
    
    await handleTransferClient(clientToModify.id, selectedAttorneyId);
    setIsTransferDialogOpen(false);
    setClientToModify(null);
    setSelectedAttorneyId('');
  };

  const renderDetailsContent = () => {
    if (!selectedClient) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setActiveTab("view")}>
            Back to List
          </Button>
          <div className="flex flex-wrap gap-2">
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
              <Button 
                variant="outline" 
                onClick={() => openTransferClientDialog(selectedClient)}
                className="flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                <span>Transfer Client</span>
              </Button>
            </RoleBasedLayout>
            
            <RoleBasedLayout requiredRoles={['admin', 'attorney']}>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => openDropClientDialog(selectedClient)}
              >
                <UserMinus className="h-4 w-4" />
                <span>Drop Client</span>
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
              <ClientDetails 
                client={selectedClient}
                onBack={() => setActiveTab("view")}
                onEdit={() => hasPermission('edit:clients') ? startEditClient(selectedClient) : null}
                onDrop={() => hasPermission('edit:clients') ? openDropClientDialog(selectedClient) : null}
                onTransfer={() => hasPermission('edit:clients') ? openTransferClientDialog(selectedClient) : null}
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
  const shouldShowAddTab = currentUser && ['admin', 'attorney'].includes(currentUser.role);

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="border-b px-6 py-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">View Clients</TabsTrigger>
            <TabsTrigger value="add">{clientToEdit ? "Edit Client" : "Add Client"}</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="view" className="p-6 space-y-4">
          <div className="flex justify-end mb-4">
            <Button 
              onClick={handleAddNewClient} 
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add New Client
            </Button>
          </div>
          
          <ClientList 
            clients={clients} 
            onEditClient={(client) => hasPermission('edit:clients') ? startEditClient(client) : null}
            onViewClient={handleViewClient}
            onDeleteClient={(client) => hasPermission('edit:clients') ? handleDeleteClient(client) : null}
            onDropClient={(client) => hasPermission('edit:clients') ? openDropClientDialog(client) : null}
            onTransferClient={(client) => hasPermission('edit:clients') ? openTransferClientDialog(client) : null}
            loading={loading}
          />
        </TabsContent>
        
        <RoleBasedLayout 
          requiredRoles={['admin', 'attorney']}
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
              attorneys={attorneys}
            />
          </TabsContent>
        </RoleBasedLayout>

        <TabsContent value="details" className="p-6 space-y-4">
          {renderDetailsContent()}
        </TabsContent>
      </Tabs>

      {/* Search Sheet */}
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
              onDropClient={(client) => hasPermission('edit:clients') ? openDropClientDialog(client) : null}
              onTransferClient={(client) => hasPermission('edit:clients') ? openTransferClientDialog(client) : null}
              loading={loading}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Drop Client Dialog */}
      <Dialog open={isDropDialogOpen} onOpenChange={setIsDropDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Drop Client</DialogTitle>
            <DialogDescription>
              This will mark the client as dropped from the firm. They will be moved to the dropped clients list.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Client: {clientToModify?.fullName}</p>
              <p className="text-sm text-muted-foreground">{clientToModify?.email}</p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="drop-reason" className="text-sm font-medium">
                Reason for dropping client
              </label>
              <Textarea
                id="drop-reason"
                value={dropReason}
                onChange={(e) => setDropReason(e.target.value)}
                placeholder="Please provide a reason for dropping this client"
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDropDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDropClient}
              disabled={!dropReason.trim()}
            >
              Drop Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Client Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Client</DialogTitle>
            <DialogDescription>
              Select an attorney to transfer this client to.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Client: {clientToModify?.fullName}</p>
              <p className="text-sm text-muted-foreground">{clientToModify?.email}</p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="attorney-select" className="text-sm font-medium">
                Select Attorney
              </label>
              <Select value={selectedAttorneyId} onValueChange={setSelectedAttorneyId}>
                <SelectTrigger id="attorney-select">
                  <SelectValue placeholder="Select an attorney" />
                </SelectTrigger>
                <SelectContent>
                  {attorneys.map((attorney) => (
                    <SelectItem 
                      key={attorney.id} 
                      value={attorney.id}
                    >
                      {attorney.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={confirmTransferClient}
              disabled={!selectedAttorneyId}
            >
              Transfer Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManagement;
