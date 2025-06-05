
import { useState, useCallback, useMemo } from 'react';
import { Client } from '@/types/client';
import { clientService, CreateClientData, UpdateClientData } from '@/services/clientService';

export const useClientManagement = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [droppedClients, setDroppedClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("view");
  const [activeDetailTab, setActiveDetailTab] = useState("overview");

  // Memoize the loadClients function to prevent infinite re-renders
  const loadClients = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      console.log("useClientManagement: Loading clients");
      
      const { active, dropped } = await clientService.getAllClients();
      
      console.log("useClientManagement: Setting clients state", { active: active.length, dropped: dropped.length });
      setClients(active);
      setDroppedClients(dropped);
      
      return true;
    } catch (error) {
      console.error("useClientManagement: Failed to load clients:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since this function doesn't depend on any external values

  // Create client
  const createClient = useCallback(async (clientData: CreateClientData): Promise<Client | null> => {
    try {
      setLoading(true);
      console.log("useClientManagement: Creating client:", clientData);
      
      const newClient = await clientService.createClient(clientData);
      
      // Add to state immediately
      setClients(prevClients => {
        console.log("useClientManagement: Adding client to state, previous count:", prevClients.length);
        const updated = [newClient, ...prevClients];
        console.log("useClientManagement: New client count:", updated.length);
        return updated;
      });
      
      console.log("useClientManagement: Client created and added to state");
      return newClient;
    } catch (error) {
      console.error("useClientManagement: Failed to create client:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update client
  const updateClient = useCallback(async (clientData: UpdateClientData): Promise<Client | null> => {
    try {
      setLoading(true);
      const updatedClient = await clientService.updateClient(clientData);
      
      if (updatedClient.isDropped) {
        setClients(prev => prev.filter(c => c.id !== clientData.id));
        setDroppedClients(prev => [...prev.filter(c => c.id !== clientData.id), updatedClient]);
      } else {
        setClients(prev => prev.map(c => c.id === clientData.id ? updatedClient : c));
      }
      
      if (selectedClient?.id === updatedClient.id) {
        setSelectedClient(updatedClient);
      }
      
      return updatedClient;
    } catch (error) {
      console.error("useClientManagement: Failed to update client:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedClient?.id]);

  // Drop client
  const dropClient = useCallback(async (clientId: string, reason: string): Promise<Client | null> => {
    try {
      const droppedClient = await clientService.dropClient(clientId, reason);
      
      setClients(prev => prev.filter(c => c.id !== clientId));
      setDroppedClients(prev => [...prev, droppedClient]);
      
      if (selectedClient?.id === clientId) {
        setSelectedClient(null);
        setActiveTab("view");
      }
      
      return droppedClient;
    } catch (error) {
      console.error("useClientManagement: Failed to drop client:", error);
      return null;
    }
  }, [selectedClient?.id]);

  // Delete client
  const deleteClient = useCallback(async (clientId: string): Promise<boolean> => {
    try {
      await clientService.deleteClient(clientId);
      
      setClients(prev => prev.filter(c => c.id !== clientId));
      setDroppedClients(prev => prev.filter(c => c.id !== clientId));
      
      if (selectedClient?.id === clientId) {
        setSelectedClient(null);
        setActiveTab("view");
      }
      
      return true;
    } catch (error) {
      console.error("useClientManagement: Failed to delete client:", error);
      return false;
    }
  }, [selectedClient?.id]);

  // View client
  const viewClient = useCallback((client: Client) => {
    setSelectedClient(client);
    setActiveTab("details");
    setActiveDetailTab("overview");
  }, []);

  // Edit client
  const editClient = useCallback((client: Client) => {
    setClientToEdit(client);
    setActiveTab("add");
  }, []);

  // Clear edit state
  const clearEditState = useCallback(() => {
    setClientToEdit(null);
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    // State
    clients,
    droppedClients,
    selectedClient,
    clientToEdit,
    loading,
    activeTab,
    activeDetailTab,
    
    // Actions
    loadClients,
    createClient,
    updateClient,
    dropClient,
    deleteClient,
    viewClient,
    editClient,
    clearEditState,
    setActiveTab,
    setActiveDetailTab,
  }), [
    clients,
    droppedClients,
    selectedClient,
    clientToEdit,
    loading,
    activeTab,
    activeDetailTab,
    loadClients,
    createClient,
    updateClient,
    dropClient,
    deleteClient,
    viewClient,
    editClient,
    clearEditState,
  ]);
};
