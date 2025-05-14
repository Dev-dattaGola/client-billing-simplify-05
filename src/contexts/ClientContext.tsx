
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client } from '@/types/client';
import { Attorney } from '@/types/attorney';
import { clientsApi } from '@/lib/api/client-api';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ClientContextType {
  clients: Client[];
  droppedClients: Client[];
  selectedClient: Client | null;
  clientToEdit: Client | null;
  attorneys: Attorney[];
  loading: boolean;
  activeTab: string;
  activeDetailTab: string;
  setActiveTab: (tab: string) => void;
  setActiveDetailTab: (tab: string) => void;
  handleAddClient: (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> & { password?: string }) => Promise<void>;
  handleEditClient: (clientData: Client) => Promise<void>;
  handleDeleteClient: (clientId: string) => Promise<void>;
  handleViewClient: (client: Client) => void;
  handleDropClient: (clientId: string, reason: string) => Promise<void>;
  handleTransferClient: (clientId: string, newAttorneyId: string) => Promise<void>;
  startEditClient: (client: Client) => void;
  clearClientToEdit: () => void;
  refreshClients: () => Promise<void>;
  loadAttorneys: () => Promise<void>;
}

export const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [droppedClients, setDroppedClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("view");
  const [activeDetailTab, setActiveDetailTab] = useState("overview");
  const { toast } = useToast();

  const refreshClients = async () => {
    try {
      setLoading(true);
      const fetchedClients = await clientsApi.getClients();
      const activeClients = fetchedClients.filter(client => !client.isDropped);
      const droppedClientsList = fetchedClients.filter(client => client.isDropped);
      
      setClients(activeClients);
      setDroppedClients(droppedClientsList);
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
  };

  const loadAttorneys = async () => {
    try {
      const attorneysList = await clientsApi.getAttorneys();
      setAttorneys(attorneysList);
    } catch (error) {
      console.error("Failed to fetch attorneys:", error);
      toast({
        title: "Error",
        description: "Failed to load attorney data.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    refreshClients();
    loadAttorneys();

    // Subscribe to changes in the clients table
    const clientsSubscription = supabase
      .channel('public:clients')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clients' },
        (payload) => {
          console.log('Change received!', payload);
          refreshClients();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(clientsSubscription);
    };
  }, []);

  const handleAddClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> & { password?: string }) => {
    try {
      const newClient = await clientsApi.createClient(clientData);
      
      if (newClient) {
        setClients(prevClients => [newClient, ...prevClients]);
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
  };

  const handleEditClient = async (clientData: Client) => {
    try {
      const updatedClient = await clientsApi.updateClient(clientData.id, clientData);
      
      if (updatedClient) {
        const updatedClients = clients.map(client => 
          client.id === clientData.id ? updatedClient : client
        );
        
        setClients(updatedClients);
        
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
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const clientName = clients.find(c => c.id === clientId)?.fullName;
      const success = await clientsApi.deleteClient(clientId);
      
      if (success) {
        setClients(clients.filter(client => client.id !== clientId));
        setDroppedClients(droppedClients.filter(client => client.id !== clientId));
        
        // If the deleted client was selected, clear the selection
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(null);
          setActiveTab("view");
        }
        
        toast({
          title: "Client Deleted",
          description: `${clientName} has been removed from your clients.`,
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
  };

  const handleDropClient = async (clientId: string, reason: string) => {
    try {
      const clientToUpdate = clients.find(c => c.id === clientId);
      if (!clientToUpdate) return;
      
      const droppedClient = await clientsApi.dropClient(clientId, reason);
      
      if (droppedClient) {
        // Remove from active clients
        setClients(clients.filter(client => client.id !== clientId));
        
        // Add to dropped clients
        setDroppedClients([droppedClient, ...droppedClients]);
        
        // If the dropped client was selected, clear the selection
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(null);
          setActiveTab("view");
        } else {
          setActiveTab("view");
        }
        
        setClientToEdit(null);
        toast({
          title: "Client Dropped",
          description: `${droppedClient.fullName} has been dropped from your active clients.`,
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
  };

  const handleTransferClient = async (clientId: string, newAttorneyId: string) => {
    try {
      const clientToTransfer = clients.find(c => c.id === clientId);
      if (!clientToTransfer) return;
      
      const attorney = attorneys.find(a => a.id === newAttorneyId);
      if (!attorney) return;
      
      const transferredClient = await clientsApi.transferClient(clientId, newAttorneyId);
      
      if (transferredClient) {
        // Remove from active clients if the current user is not the new attorney
        setClients(clients.filter(client => client.id !== clientId));
        
        // If the transferred client was selected, clear the selection
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(null);
          setActiveTab("view");
        } else {
          setActiveTab("view");
        }
        
        setClientToEdit(null);
        toast({
          title: "Client Transferred",
          description: `${transferredClient.fullName} has been transferred to ${attorney.fullName}.`,
        });
      } else {
        throw new Error("Failed to transfer client");
      }
    } catch (error) {
      console.error("Error transferring client:", error);
      toast({
        title: "Error",
        description: "Failed to transfer client. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setActiveTab("details");
    setActiveDetailTab("overview");
  };

  const startEditClient = (client: Client) => {
    setClientToEdit(client);
    setActiveTab("add");
  };

  const clearClientToEdit = () => {
    setClientToEdit(null);
  };

  const contextValue = {
    clients,
    droppedClients,
    selectedClient,
    clientToEdit,
    attorneys,
    loading,
    activeTab,
    activeDetailTab,
    setActiveTab,
    setActiveDetailTab,
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
    handleDropClient,
    handleTransferClient,
    handleViewClient,
    startEditClient,
    clearClientToEdit,
    refreshClients,
    loadAttorneys
  };

  return (
    <ClientContext.Provider value={contextValue}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};
