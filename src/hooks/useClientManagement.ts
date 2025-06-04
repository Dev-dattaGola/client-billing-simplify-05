
import { useState, useCallback, useEffect } from 'react';
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

  // Load all clients
  const loadClients = useCallback(async () => {
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
  }, []);

  // Create client
  const createClient = useCallback(async (clientData: CreateClientData): Promise<Client | null> => {
    try {
      setLoading(true);
      console.log("useClientManagement: Creating client:", clientData);
      
      const newClient = await clientService.createClient(clientData);
      
      // Add to state immediately
      setClients(prevClients => [newClient, ...prevClients]);
      
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
      
      // Update state
      if (updatedClient.isDropped) {
        setClients(prev => prev.filter(c => c.id !== clientData.id));
        setDroppedClients(prev => [...prev.filter(c => c.id !== clientData.id), updatedClient]);
      } else {
        setClients(prev => prev.map(c => c.id === clientData.id ? updatedClient : c));
      }
      
      // Update selected client if it's the one being edited
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
  }, [selectedClient]);

  // Drop client
  const dropClient = useCallback(async (clientId: string, reason: string): Promise<Client | null> => {
    try {
      const droppedClient = await clientService.dropClient(clientId, reason);
      
      // Move from active to dropped
      setClients(prev => prev.filter(c => c.id !== clientId));
      setDroppedClients(prev => [...prev, droppedClient]);
      
      // Clear selection if this client was selected
      if (selectedClient?.id === clientId) {
        setSelectedClient(null);
        setActiveTab("view");
      }
      
      return droppedClient;
    } catch (error) {
      console.error("useClientManagement: Failed to drop client:", error);
      return null;
    }
  }, [selectedClient]);

  // Delete client
  const deleteClient = useCallback(async (clientId: string): Promise<boolean> => {
    try {
      await clientService.deleteClient(clientId);
      
      // Remove from both lists
      setClients(prev => prev.filter(c => c.id !== clientId));
      setDroppedClients(prev => prev.filter(c => c.id !== clientId));
      
      // Clear selection if this client was selected
      if (selectedClient?.id === clientId) {
        setSelectedClient(null);
        setActiveTab("view");
      }
      
      return true;
    } catch (error) {
      console.error("useClientManagement: Failed to delete client:", error);
      return false;
    }
  }, [selectedClient]);

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

  return {
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
  };
};
