
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client } from '@/types/client';
import { clientsApi } from '@/lib/api/client-api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ClientContextType {
  clients: Client[];
  selectedClient: Client | null;
  clientToEdit: Client | null;
  loading: boolean;
  activeTab: string;
  activeDetailTab: string;
  showDropped: boolean;
  setShowDropped: (show: boolean) => void;
  setActiveTab: (tab: string) => void;
  setActiveDetailTab: (tab: string) => void;
  handleAddClient: (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  handleEditClient: (clientData: Client) => Promise<void>;
  handleDeleteClient: (clientId: string) => Promise<void>;
  handleDropClient: (clientId: string, reason: string) => Promise<void>;
  handleViewClient: (client: Client) => void;
  startEditClient: (client: Client) => void;
  clearClientToEdit: () => void;
  refreshClients: () => Promise<void>;
  getAttorneyOptions: () => { value: string; label: string }[];
}

export const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("view");
  const [activeDetailTab, setActiveDetailTab] = useState("overview");
  const [showDropped, setShowDropped] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const refreshClients = async () => {
    try {
      setLoading(true);
      const fetchedClients = await clientsApi.getClients();
      setClients(fetchedClients);
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

  useEffect(() => {
    refreshClients();
  }, []);

  const handleAddClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newClient = await clientsApi.createClient(clientData);
      
      if (newClient) {
        setClients([...clients, newClient]);
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
      const client = clients.find(c => c.id === clientId);
      if (!client) {
        throw new Error("Client not found");
      }
      
      const updatedData = {
        ...client,
        is_dropped: true,
        dropped_date: new Date().toISOString(),
        dropped_reason: reason
      };
      
      const updatedClient = await clientsApi.updateClient(clientId, updatedData);
      
      if (updatedClient) {
        const updatedClients = clients.map(client => 
          client.id === clientId ? updatedClient : client
        );
        
        setClients(updatedClients);
        
        // If the dropped client was selected, update the selected client
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(updatedClient);
        }
        
        toast({
          title: "Client Dropped",
          description: `${updatedClient.fullName} has been marked as dropped.`,
        });
        
        // Return to the client list view
        setActiveTab("view");
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

  // Function to get attorney options for dropdown
  const getAttorneyOptions = () => {
    // This would typically be fetched from an API
    // For now, we'll return mock data
    return [
      { value: "attorney1", label: "John Smith" },
      { value: "attorney2", label: "Jane Doelawyer" },
      { value: "attorney3", label: "Robert Johnson" },
      { value: "attorney4", label: "Maria Rodriguez" }
    ];
  };

  const contextValue = {
    clients,
    selectedClient,
    clientToEdit,
    loading,
    activeTab,
    activeDetailTab,
    showDropped,
    setShowDropped,
    setActiveTab,
    setActiveDetailTab,
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
    handleDropClient,
    handleViewClient,
    startEditClient,
    clearClientToEdit,
    refreshClients,
    getAttorneyOptions
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
