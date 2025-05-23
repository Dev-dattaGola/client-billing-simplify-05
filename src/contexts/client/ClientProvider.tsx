
import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from 'react';
import { useClientActions } from './useClientActions';
import { ClientContextType } from './types';
import { useAuth } from '@/contexts/AuthContext';

export const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const clientActions = useClientActions();
  const [initialized, setInitialized] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Use callback to prevent dependency changes causing re-renders
  const initializeClients = useCallback(async () => {
    if (isAuthenticated && !initialized) {
      console.log("ClientProvider: Loading clients");
      try {
        const result = await clientActions.refreshClients();
        if (result) {
          setInitialized(true);
          console.log("ClientProvider: Clients loaded successfully");
        } else {
          console.error("ClientProvider: Failed to load clients");
        }
      } catch (error) {
        console.error("ClientProvider: Error loading clients:", error);
      }
    }
  }, [isAuthenticated, initialized, clientActions]);
  
  // Use effect to load clients on mount or when authentication state changes
  useEffect(() => {
    console.log("ClientProvider effect running, auth:", isAuthenticated, "initialized:", initialized);
    
    if (!isAuthenticated && initialized) {
      // Reset initialized state when auth changes
      setInitialized(false);
      return;
    }
    
    if (isAuthenticated && !initialized) {
      // Using setTimeout to avoid potential render-during-render issues
      const timeout = setTimeout(() => {
        initializeClients();
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, initialized, initializeClients]);
  
  // Memoize the context value to prevent unnecessary renders
  const contextValue = useMemo(() => ({
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

  console.log("ClientProvider rendering, initialized:", initialized, "activeTab:", clientActions.activeTab);
  
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
