
import { useState, useCallback, useMemo } from 'react';
import { Client } from '@/types/client';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useClientActions = () => {
  // State declarations
  const [clients, setClients] = useState<Client[]>([]);
  const [droppedClients, setDroppedClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("view");
  const [activeDetailTab, setActiveDetailTab] = useState("overview");
  const { toast } = useToast();

  // Refresh clients - memoized
  const refreshClients = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch from Supabase
      const { data: fetchedClients, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Separate active and dropped clients
      const active = fetchedClients?.filter(client => !client.is_dropped) || [];
      const dropped = fetchedClients?.filter(client => client.is_dropped) || [];
      
      setClients(active);
      setDroppedClients(dropped);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
      toast({
        title: "Error",
        description: "Failed to load client data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Add client with password creation - memoized
  const handleAddClient = useCallback(async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // First, create auth user with email and password
      const password = clientData.password as string;
      delete (clientData as any).password;
      
      // Create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: clientData.email,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: clientData.fullName,
          role: 'client'
        }
      });
      
      if (authError) throw authError;
      
      // Then, create the client record with reference to user
      const clientToInsert = {
        ...clientData,
        user_id: authData.user.id,
      };
      
      const { data: newClient, error } = await supabase
        .from('clients')
        .insert(clientToInsert)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (newClient) {
        setClients(prevClients => [newClient, ...prevClients]);
        setActiveTab("view");
        toast({
          title: "Client Added",
          description: `${newClient.full_name} has been added to your clients.`,
        });
        return newClient;
      } else {
        throw new Error("Failed to create client");
      }
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Edit client - memoized
  const handleEditClient = useCallback(async (clientData: Client) => {
    try {
      // Update client record in Supabase
      const { data: updatedClient, error } = await supabase
        .from('clients')
        .update({
          full_name: clientData.fullName,
          email: clientData.email,
          phone: clientData.phone,
          company_name: clientData.companyName,
          address: clientData.address,
          tags: clientData.tags,
          notes: clientData.notes,
          assigned_attorney_id: clientData.assignedAttorneyId,
        })
        .eq('id', clientData.id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (updatedClient) {
        // Update the appropriate list based on dropped status
        if (updatedClient.is_dropped) {
          setClients(prevClients => prevClients.filter(client => client.id !== clientData.id));
          setDroppedClients(prevDropped => [...prevDropped.filter(client => client.id !== clientData.id), updatedClient]);
        } else {
          setClients(prevClients => prevClients.map(client => 
            client.id === clientData.id ? updatedClient : client
          ));
        }
        
        // If we're editing from the details view, update the selected client too
        if (selectedClient && selectedClient.id === updatedClient.id) {
          setSelectedClient(updatedClient);
          setActiveTab("details");
        } else {
          setActiveTab("view");
        }
        
        setClientToEdit(null);
        toast({
          title: "Client Updated",
          description: `${updatedClient.full_name}'s information has been updated.`,
        });
        
        return updatedClient;
      } else {
        throw new Error("Failed to update client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: "Failed to update client. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [selectedClient, toast]);

  // Drop client - memoized
  const handleDropClient = useCallback(async (clientId: string, reason: string) => {
    try {
      const clientToDrop = clients.find(c => c.id === clientId);
      if (!clientToDrop) {
        throw new Error("Client not found");
      }
      
      const { data: updatedClient, error } = await supabase
        .from('clients')
        .update({
          is_dropped: true,
          dropped_date: new Date().toISOString(),
          dropped_reason: reason,
        })
        .eq('id', clientId)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (updatedClient) {
        // Move client from active to dropped list
        setClients(prevClients => prevClients.filter(client => client.id !== clientId));
        setDroppedClients(prevDropped => [...prevDropped, updatedClient]);
        
        // If the dropped client was selected, clear the selection
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(null);
          setActiveTab("view");
        }
        
        toast({
          title: "Client Dropped",
          description: `${updatedClient.full_name} has been marked as dropped.`,
        });
        
        return updatedClient;
      } else {
        throw new Error("Failed to drop client");
      }
    } catch (error) {
      console.error("Error dropping client:", error);
      toast({
        title: "Error",
        description: "Failed to drop client. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [clients, selectedClient, toast]);

  // Delete client - memoized
  const handleDeleteClient = useCallback(async (clientId: string) => {
    try {
      const clientToDelete = clients.find(c => c.id === clientId) || 
                           droppedClients.find(c => c.id === clientId);
                           
      if (!clientToDelete) {
        throw new Error("Client not found");
      }
      
      // If client has a user account, disable it
      if (clientToDelete.user_id) {
        const { error: authError } = await supabase.auth.admin.deleteUser(
          clientToDelete.user_id
        );
        
        if (authError) {
          console.error("Error disabling client user account:", authError);
        }
      }
      
      // Delete the client record
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);
      
      if (error) throw error;
      
      // Update state
      setClients(prevClients => prevClients.filter(client => client.id !== clientId));
      setDroppedClients(prevDropped => prevDropped.filter(client => client.id !== clientId));
      
      // If the deleted client was selected, clear the selection
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(null);
        setActiveTab("view");
      }
      
      toast({
        title: "Client Deleted",
        description: `${clientToDelete.fullName || clientToDelete.full_name} has been permanently removed.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [clients, droppedClients, selectedClient, toast]);

  // View client - memoized
  const handleViewClient = useCallback((client: Client) => {
    setSelectedClient(client);
    setActiveTab("details");
    setActiveDetailTab("overview");
  }, []);

  // Start edit client - memoized
  const startEditClient = useCallback((client: Client) => {
    setClientToEdit(client);
    setActiveTab("add");
  }, []);

  // Clear client to edit - memoized
  const clearClientToEdit = useCallback(() => {
    setClientToEdit(null);
  }, []);

  // Memoize the entire state object to prevent unnecessary re-renders
  const stateAndActions = useMemo(() => ({
    // State
    clients,
    droppedClients,
    selectedClient,
    clientToEdit,
    loading,
    activeTab,
    activeDetailTab,
    
    // State setters
    setActiveTab,
    setActiveDetailTab,
    
    // Actions
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
    handleDropClient,
    handleViewClient,
    startEditClient,
    clearClientToEdit,
    refreshClients
  }), [
    clients, 
    droppedClients, 
    selectedClient, 
    clientToEdit, 
    loading, 
    activeTab, 
    activeDetailTab,
    handleAddClient,
    handleEditClient, 
    handleDeleteClient, 
    handleDropClient,
    handleViewClient,
    startEditClient,
    clearClientToEdit,
    refreshClients
  ]);

  return stateAndActions;
};
