
import React, { createContext, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useClientManagement } from '@/hooks/useClientManagement';
import { useAuth } from '@/contexts/AuthContext';
import { Client } from '@/types/client';
import { CreateClientData, UpdateClientData } from '@/services/clientService';

interface ClientContextType {
  clients: Client[];
  droppedClients: Client[];
  selectedClient: Client | null;
  clientToEdit: Client | null;
  loading: boolean;
  activeTab: string;
  activeDetailTab: string;
  setActiveTab: (tab: string) => void;
  setActiveDetailTab: (tab: string) => void;
  loadClients: () => Promise<boolean>;
  createClient: (data: CreateClientData) => Promise<Client | null>;
  updateClient: (data: UpdateClientData) => Promise<Client | null>;
  dropClient: (id: string, reason: string) => Promise<Client | null>;
  deleteClient: (id: string) => Promise<boolean>;
  viewClient: (client: Client) => void;
  editClient: (client: Client) => void;
  startEditClient: (client: Client) => void;
  clearEditState: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const clientManagement = useClientManagement();

  // Use useCallback to ensure stable reference for loadClients
  const stableLoadClients = useCallback(() => {
    return clientManagement.loadClients();
  }, [clientManagement.loadClients]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("ClientProvider: Loading clients on auth change");
      stableLoadClients();
    }
  }, [isAuthenticated, stableLoadClients]);

  const contextValue = {
    ...clientManagement,
    startEditClient: clientManagement.editClient, // Alias for backward compatibility
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
