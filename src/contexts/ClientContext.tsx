
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Client } from '@/types/client';

interface ClientContextType {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  selectedClient: Client | null;
  setSelectedClient: React.Dispatch<React.SetStateAction<Client | null>>;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
  transferClient: (client: Client, attorneyId: string) => void;
  dropClient: (client: Client) => void;
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

  const addClient = (client: Client) => {
    setClients(prevClients => [...prevClients, client]);
  };

  const updateClient = (client: Client) => {
    setClients(prevClients =>
      prevClients.map(c => (c.id === client.id ? client : c))
    );
    
    if (selectedClient && selectedClient.id === client.id) {
      setSelectedClient(client);
    }
  };

  const deleteClient = (clientId: string) => {
    setClients(prevClients => prevClients.filter(c => c.id !== clientId));
    
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(null);
    }
  };

  const transferClient = (client: Client, attorneyId: string) => {
    const updatedClient = { ...client, assignedAttorneyId: attorneyId };
    updateClient(updatedClient);
  };

  const dropClient = (client: Client) => {
    const updatedClient = { ...client, assignedAttorneyId: undefined };
    updateClient(updatedClient);
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        setClients,
        selectedClient,
        setSelectedClient,
        addClient,
        updateClient,
        deleteClient,
        transferClient,
        dropClient
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
