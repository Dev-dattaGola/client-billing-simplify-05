
import { useState, useCallback, useMemo } from 'react';
import { Client } from '@/types/client';
import { clientsApi } from '@/lib/api/client-api';
import { useToast } from '@/hooks/use-toast';

export const useClientActions = () => {
  // State declarations
  const [clients, setClients] = useState<Client[]>([]);
  const [droppedClients, setDroppedClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("view");
  const [activeDetailTab, setActiveDetailTab] = useState("overview");
  const { toast } = useToast();

  // Refresh clients - memoized
  const refreshClients = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedClients = await clientsApi.getClients();
      
      // Separate active and dropped clients
      const active = fetchedClients.filter(client => !client.isDropped);
      const dropped = fetchedClients.filter(client => client.isDropped);
      
      setClients(active);
      setDroppedClients(dropped);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
      toast({
        title: "Error",
        description: "Failed to load client data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Add client - memoized
  const handleAddClient = useCallback(async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newClient = await clientsApi.createClient(clientData);
      
      if (newClient) {
        setClients(prevClients => [...prevClients, newClient]);
        setActiveTab("view");
        toast({
          title: "Client Added",
          description: `${newClient.fullName} has been added to your clients.`,
        });
      } else {
        throw new Error("Failed to create client");
      }
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Edit client - memoized
  const handleEditClient = useCallback(async (clientData: Client) => {
    try {
      const updatedClient = await clientsApi.updateClient(clientData.id, clientData);
      
      if (updatedClient) {
        // Update the appropriate list based on dropped status
        if (updatedClient.isDropped) {
          setClients(prevClients => prevClients.filter(client => client.id !== clientData.id));
          setDroppedClients(prevDropped => [...prevDropped.filter(client => client.id !== clientData.id), updatedClient]);
        } else {
          setClients(prevClients => prevClients.map(client => 
            client.id === clientData.id ? updatedClient : client
          ));
        }
        
        // If we're editing from the details view, update the selected client too
        if (selectedClient && selectedClient.id === updatedClient.id) {
          setSelectedClient(updatedClient);
          setActiveTab("details");
        } else {
          setActiveTab("view");
        }
        
        setClientToEdit(null);
        toast({
          title: "Client Updated",
          description: `${updatedClient.fullName}'s information has been updated.`,
        });
      } else {
        throw new Error("Failed to update client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: "Failed to update client. Please try again.",
        variant: "destructive",
      });
    }
  }, [selectedClient, toast]);

  // Drop client - memoized
  const handleDropClient = useCallback(async (clientId: string, reason: string) => {
    try {
      const clientToDrop = clients.find(c => c.id === clientId);
      if (!clientToDrop) {
        throw new Error("Client not found");
      }
      
      const droppedData = {
        isDropped: true,
        droppedDate: new Date().toISOString(),
        droppedReason: reason,
      };
      
      const updatedClient = await clientsApi.updateClient(clientId, droppedData);
      
      if (updatedClient) {
        // Move client from active to dropped list
        setClients(prevClients => prevClients.filter(client => client.id !== clientId));
        setDroppedClients(prevDropped => [...prevDropped, updatedClient]);
        
        // If the dropped client was selected, clear the selection
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(null);
          setActiveTab("view");
        }
        
        toast({
          title: "Client Dropped",
          description: `${updatedClient.fullName} has been marked as dropped.`,
        });
      } else {
        throw new Error("Failed to drop client");
      }
    } catch (error) {
      console.error("Error dropping client:", error);
      toast({
        title: "Error",
        description: "Failed to drop client. Please try again.",
        variant: "destructive",
      });
    }
  }, [clients, selectedClient, toast]);

  // Delete client - memoized
  const handleDeleteClient = useCallback(async (clientId: string) => {
    try {
      const clientName = clients.find(c => c.id === clientId)?.fullName || 
                         droppedClients.find(c => c.id === clientId)?.fullName;
      const success = await clientsApi.deleteClient(clientId);
      
      if (success) {
        setClients(prevClients => prevClients.filter(client => client.id !== clientId));
        setDroppedClients(prevDropped => prevDropped.filter(client => client.id !== clientId));
        
        // If the deleted client was selected, clear the selection
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(null);
          setActiveTab("view");
        }
        
        toast({
          title: "Client Deleted",
          description: `${clientName} has been permanently removed.`,
        });
      } else {
        throw new Error("Failed to delete client");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      });
    }
  }, [clients, droppedClients, selectedClient, toast]);

  // View client - memoized
  const handleViewClient = useCallback((client: Client) => {
    setSelectedClient(client);
    setActiveTab("details");
    setActiveDetailTab("overview");
  }, []);

  // Start edit client - memoized
  const startEditClient = useCallback((client: Client) => {
    setClientToEdit(client);
    setActiveTab("add");
  }, []);

  // Clear client to edit - memoized
  const clearClientToEdit = useCallback(() => {
    setClientToEdit(null);
  }, []);

  // Memoize the entire state object to prevent unnecessary re-renders
  const stateAndActions = useMemo(() => ({
    // State
    clients,
    droppedClients,
    selectedClient,
    clientToEdit,
    loading,
    activeTab,
    activeDetailTab,
    
    // State setters
    setActiveTab,
    setActiveDetailTab,
    
    // Actions
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
    handleDropClient,
    handleViewClient,
    startEditClient,
    clearClientToEdit,
    refreshClients
  }), [
    clients, 
    droppedClients, 
    selectedClient, 
    clientToEdit, 
    loading, 
    activeTab, 
    activeDetailTab,
    handleAddClient,
    handleEditClient, 
    handleDeleteClient, 
    handleDropClient,
    handleViewClient,
    startEditClient,
    clearClientToEdit,
    refreshClients
  ]);

  return stateAndActions;
};
