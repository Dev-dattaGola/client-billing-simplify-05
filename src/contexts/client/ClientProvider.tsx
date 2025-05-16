
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useClientActions } from './useClientActions';
import { ClientContextType } from './types';

export const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const clientActions = useClientActions();
  const [initialized, setInitialized] = useState(false);
  
  // Use effect to load clients on mount
  useEffect(() => {
    console.log("ClientProvider: Loading clients");
    clientActions.refreshClients();
    setInitialized(true);
    // We only want to run this once when the component mounts
  }, []);
  
  // Avoid creating a new context value on each render by storing clientActions directly
  // Note: We're not using useMemo here because it's causing the hooks error
  
  return (
    <ClientContext.Provider value={clientActions}>
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
