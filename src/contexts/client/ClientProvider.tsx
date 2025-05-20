
import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { useClientActions } from './useClientActions';
import { ClientContextType } from './types';
import { useAuth } from '@/contexts/AuthContext';

export const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const clientActions = useClientActions();
  const [initialized, setInitialized] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Use effect to load clients on mount or when authentication state changes
  useEffect(() => {
    if (isAuthenticated && !initialized) {
      console.log("ClientProvider: Loading clients");
      clientActions.refreshClients();
      setInitialized(true);
    }
  }, [isAuthenticated, initialized, clientActions]);
  
  // Memoize the context value to prevent unnecessary renders
  const contextValue: ClientContextType = useMemo(() => ({
    clients: clientActions.clients,
    droppedClients: clientActions.droppedClients,
    selectedClient: clientActions.selectedClient,
    clientToEdit: clientActions.clientToEdit,
    loading: clientActions.loading,
    activeTab: clientActions.activeTab,
    activeDetailTab: clientActions.activeDetailTab,
    setActiveTab: clientActions.setActiveTab,
    setActiveDetailTab: clientActions.setActiveDetailTab,
    handleAddClient: clientActions.handleAddClient,
    handleEditClient: clientActions.handleEditClient,
    handleDeleteClient: clientActions.handleDeleteClient,
    handleDropClient: clientActions.handleDropClient,
    handleViewClient: clientActions.handleViewClient,
    startEditClient: clientActions.startEditClient,
    clearClientToEdit: clientActions.clearClientToEdit,
    refreshClients: clientActions.refreshClients
  }), [
    clientActions.clients,
    clientActions.droppedClients,
    clientActions.selectedClient,
    clientActions.clientToEdit,
    clientActions.loading,
    clientActions.activeTab,
    clientActions.activeDetailTab,
    clientActions.setActiveTab,
    clientActions.setActiveDetailTab,
    clientActions.handleAddClient,
    clientActions.handleEditClient,
    clientActions.handleDeleteClient,
    clientActions.handleDropClient,
    clientActions.handleViewClient,
    clientActions.startEditClient,
    clientActions.clearClientToEdit,
    clientActions.refreshClients
  ]);
  
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
