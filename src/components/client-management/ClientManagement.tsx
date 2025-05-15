
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PlusCircle, Edit, Trash2, UserMinus, UserPlus } from "lucide-react";
import { useClientContext } from "@/contexts/ClientContext";
import ClientList from "./ClientList";
import ClientDetails from "./ClientDetails";
import ClientForm from "./ClientForm";
import { Client } from "@/types/client";

const ClientManagement = () => {
  // Get client context
  const { 
    clients,
    selectedClient, 
    editingClient,
    addClient,
    updateClient,
    deleteClient,
    handleViewClient,
    startEditClient,
    clearClientToEdit,
    transferClient,
    dropClient
  } = useClientContext();
  
  // Local state
  const [activeTab, setActiveTab] = useState<string>("view");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDropClientModalOpen, setIsDropClientModalOpen] = useState(false);
  const [selectedAttorneyForTransfer, setSelectedAttorneyForTransfer] = useState("");
  const [dropReason, setDropReason] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Mock list of attorneys for the demo (in a real app, this would come from API)
  const attorneys = [
    { id: "atty1", name: "Sarah Johnson" },
    { id: "atty2", name: "Robert Lee" },
    { id: "atty3", name: "Jennifer Parker" },
    { id: "atty4", name: "Michael Chen" }
  ];
  
  // Helper to get attorney name by ID
  const getAttorneyName = (id: string) => {
    const attorney = attorneys.find(a => a.id === id);
    return attorney ? attorney.name : "Unknown Attorney";
  };
  
  // Handle add button click
  const handleAddClick = () => {
    clearClientToEdit();
    setActiveTab("add");
  };
  
  // Handle edit button click
  const handleEditClick = () => {
    if (!selectedClient) return;
    startEditClient(selectedClient);
    setActiveTab("edit");
  };
  
  // Handle delete button click - opens confirmation dialog
  const handleDeleteClick = () => {
    if (!selectedClient) return;
    setIsDeleteModalOpen(true);
  };
  
  // Handle transfer client click - opens transfer dialog
  const handleTransferClick = () => {
    if (!selectedClient) return;
    setIsTransferModalOpen(true);
  };
  
  // Handle drop client click - opens drop client dialog
  const handleDropClientClick = () => {
    if (!selectedClient) return;
    setIsDropClientModalOpen(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (!selectedClient || deleteConfirmText !== "DELETE") return;
    
    deleteClient(selectedClient.id);
    setIsDeleteModalOpen(false);
    setDeleteConfirmText("");
    setActiveTab("view");
    
    toast.success("Client deleted successfully", {
      position: "bottom-right",
    });
  };
  
  // Handle form submission for adding a new client
  const handleAddSubmit = (clientData: Omit<Client, "id">) => {
    addClient(clientData);
    setActiveTab("view");
    
    toast.success("Client added successfully", {
      position: "bottom-right",
    });
    
    // Simulate loading time to show toast
    setTimeout(() => {
      // After a client is added, view the newly added client
      // In reality, the API would return the new client with an ID
      const newClient = clients[clients.length - 1];
      if (newClient) {
        handleViewClient(newClient);
      }
    }, 2000);
  };
  
  // Handle client transfer function - fix type error by passing the client object instead of just ID
  const handleTransferClient = () => {
    if (!selectedClient || !selectedAttorneyForTransfer) return;
    
    // Find out if the client is already assigned to this attorney
    if (selectedClient.assignedAttorneyId === selectedAttorneyForTransfer) {
      toast.error("Client is already assigned to this attorney", {
        position: "bottom-right",
      });
      setIsTransferModalOpen(false);
      return;
    }
    
    const attorneyName = getAttorneyName(selectedAttorneyForTransfer);
    
    // Pass the entire client object instead of just the ID
    transferClient(selectedClient, selectedAttorneyForTransfer, attorneyName);
    setIsTransferModalOpen(false);
    setSelectedAttorneyForTransfer("");
    
    toast.success(`Client transferred to ${attorneyName}`, {
      position: "bottom-right",
      duration: 3000
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
    
    toast.success("Client status changed to dropped", {
      position: "bottom-right",
    });
  };
  
  // Handle form submission for editing client
  const handleEditSubmit = (clientData: Omit<Client, "id">) => {
    if (!editingClient) return;
    
    updateClient({
      id: editingClient.id,
      ...clientData
    });
    
    setActiveTab("view");
    toast.success("Client updated successfully", {
      position: "bottom-right",
    });
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <TabsList>
          <TabsTrigger value="view">View Clients</TabsTrigger>
          <TabsTrigger value="add">Add Client</TabsTrigger>
          {editingClient && <TabsTrigger value="edit">Edit Client</TabsTrigger>}
        </TabsList>
        
        <div className="flex gap-2">
          {selectedClient && (
            <>
              <Button variant="outline" size="sm" onClick={handleEditClick}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={handleTransferClick}>
                <UserPlus className="mr-2 h-4 w-4" />
                Transfer
              </Button>
              <Button variant="outline" size="sm" onClick={handleDropClientClick}>
                <UserMinus className="mr-2 h-4 w-4" />
                Drop
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          )}
          
          {activeTab !== "add" && (
            <Button size="sm" onClick={handleAddClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          )}
        </div>
      </div>
      
      <TabsContent value="view" className="flex-1 overflow-auto">
        <div className="grid md:grid-cols-3 gap-6 h-full">
          <div className="md:col-span-1 border rounded-md shadow-sm overflow-hidden">
            <ClientList />
          </div>
          <div className="md:col-span-2 border rounded-md shadow-sm p-4">
            {selectedClient ? (
              <ClientDetails client={selectedClient} />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Select a client to view details
              </div>
            )}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="add" className="flex-1">
        <div className="max-w-3xl mx-auto border rounded-md shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Client</h2>
          <ClientForm onSubmit={handleAddSubmit} onCancel={() => setActiveTab("view")} />
        </div>
      </TabsContent>
      
      <TabsContent value="edit" className="flex-1">
        {editingClient ? (
          <div className="max-w-3xl mx-auto border rounded-md shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Client</h2>
            <ClientForm initialData={editingClient} onSubmit={handleEditSubmit} onCancel={() => setActiveTab("view")} />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No client selected for editing
          </div>
        )}
      </TabsContent>
      
      {/* Delete confirmation modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the client and all associated records.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirm">Type DELETE to confirm</Label>
              <Input
                id="confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deleteConfirmText !== "DELETE"}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Transfer client modal */}
      <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Client</DialogTitle>
            <DialogDescription>
              Select the attorney you want to transfer this client to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="attorney">Select Attorney</Label>
              <Select 
                value={selectedAttorneyForTransfer} 
                onValueChange={setSelectedAttorneyForTransfer}
              >
                <SelectTrigger id="attorney">
                  <SelectValue placeholder="Select an attorney" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {attorneys.map((attorney) => (
                      <SelectItem key={attorney.id} value={attorney.id}>
                        {attorney.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleTransferClient}
              disabled={!selectedAttorneyForTransfer}
            >
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Drop client modal */}
      <Dialog open={isDropClientModalOpen} onOpenChange={setIsDropClientModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Drop Client</DialogTitle>
            <DialogDescription>
              Please provide a reason for dropping this client.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={dropReason}
                onChange={(e) => setDropReason(e.target.value)}
                placeholder="Explain why this client is being dropped..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDropClientModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleDropClient}
              disabled={!dropReason}
            >
              Drop Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
};

export default ClientManagement;
