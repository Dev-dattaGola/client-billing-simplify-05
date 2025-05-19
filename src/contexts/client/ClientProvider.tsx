
import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { useClientActions } from './useClientActions';
import { ClientContextType } from './types';

export const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const clientActions = useClientActions();
  const [initialized, setInitialized] = useState(false);
  
  // Use effect to load clients on mount - only once
  useEffect(() => {
    if (!initialized) {
      console.log("ClientProvider: Loading clients");
      clientActions.refreshClients();
      setInitialized(true);
    }
  }, [initialized]);
  
  // Memoize the context value to prevent unnecessary renders
  const contextValue = useMemo(() => clientActions, [
    clientActions.clients,
    clientActions.droppedClients,
    clientActions.selectedClient,
    clientActions.clientToEdit,
    clientActions.loading,
    clientActions.activeTab,
    clientActions.activeDetailTab
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
