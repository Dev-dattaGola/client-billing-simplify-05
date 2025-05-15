
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Client } from '@/types/client';

interface ClientContextType {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  selectedClient: Client | null;
  setSelectedClient: React.Dispatch<React.SetStateAction<Client | null>>;
  clientToEdit: Client | null;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (client: Client) => void;
  deleteClient: (client: Client) => void;
  transferClient: (client: Client, attorneyId: string) => void;
  dropClient: (client: Client, reason: string) => void;
  handleAddClient: (clientData: Omit<Client, "id">) => void;
  handleEditClient: (client: Client) => void;
  handleDeleteClient: (client: Client) => void;
  handleViewClient: (client: Client | null) => void;
  startEditClient: (client: Client) => void;
  clearClientToEdit: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};

interface ClientProviderProps {
  children: ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<string>("view");

  // Basic client operations
  const addClient = (clientData: Omit<Client, "id">) => {
    // Generate a random ID (in a real app, this would come from the backend)
    const newClient: Client = {
      id: `client-${Date.now()}`,
      ...clientData,
      createdAt: new Date().toISOString(),
    };
    
    setClients(prevClients => [...prevClients, newClient]);
    return newClient;
  };

  const updateClient = (client: Client) => {
    setClients(prevClients =>
      prevClients.map(c => (c.id === client.id ? client : c))
    );
    
    if (selectedClient && selectedClient.id === client.id) {
      setSelectedClient(client);
    }
    
    if (clientToEdit && clientToEdit.id === client.id) {
      setClientToEdit(null);
    }
  };

  const deleteClient = (client: Client) => {
    setClients(prevClients => prevClients.filter(c => c.id !== client.id));
    
    if (selectedClient && selectedClient.id === client.id) {
      setSelectedClient(null);
    }
    
    if (clientToEdit && clientToEdit.id === client.id) {
      setClientToEdit(null);
    }
  };

  const transferClient = (client: Client, attorneyId: string) => {
    const updatedClient = { 
      ...client, 
      assignedAttorneyId: attorneyId,
      assignedAttorney: attorneyId // This is for backward compatibility
    };
    updateClient(updatedClient);
  };

  const dropClient = (client: Client, reason: string) => {
    const updatedClient = { 
      ...client, 
      status: 'dropped' as const,
      dropReason: reason
    };
    updateClient(updatedClient);
  };

  // UI action handlers
  const handleAddClient = (clientData: Omit<Client, "id">) => {
    const newClient = addClient(clientData);
    setSelectedClient(newClient);
    setActiveTab("view");
  };

  const handleEditClient = (client: Client) => {
    updateClient(client);
    setSelectedClient(client);
    setClientToEdit(null);
    setActiveTab("view");
  };

  const handleDeleteClient = (client: Client) => {
    deleteClient(client);
    setActiveTab("view");
  };

  const handleViewClient = (client: Client | null) => {
    setSelectedClient(client);
    setClientToEdit(null);
  };

  const startEditClient = (client: Client) => {
    setClientToEdit({...client});
  };

  const clearClientToEdit = () => {
    setClientToEdit(null);
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        setClients,
        selectedClient,
        setSelectedClient,
        clientToEdit,
        activeTab,
        setActiveTab,
        addClient,
        updateClient,
        deleteClient,
        transferClient,
        dropClient,
        handleAddClient,
        handleEditClient,
        handleDeleteClient,
        handleViewClient,
        startEditClient,
        clearClientToEdit
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
