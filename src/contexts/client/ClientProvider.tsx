
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useClientActions } from './useClientActions';
import { ClientContextType } from './types';

export const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const clientActions = useClientActions();
  
  // Use effect to load clients on mount
  React.useEffect(() => {
    clientActions.refreshClients();
    // We only want to run this once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...clientActions
  }), [clientActions]);

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
