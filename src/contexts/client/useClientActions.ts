
import { useState, useCallback, useMemo } from 'react';
import { Client, mapDbClientToClient, mapClientToDbClient } from '@/types/client';
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
      
      // Map database objects to client objects with proper camelCase properties
      const mappedClients = fetchedClients?.map(mapDbClientToClient) || [];
      
      // Separate active and dropped clients
      const active = mappedClients.filter(client => !client.isDropped);
      const dropped = mappedClients.filter(client => client.isDropped);
      
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
  const handleAddClient = useCallback(async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client | null> => {
    try {
      // Extract password for auth user creation
      const password = clientData.password as string;
      if (!password) {
        throw new Error("Password is required for new client accounts");
      }
      
      // Create auth user using the edge function
      const { data: authData, error: authError } = await supabase.functions.invoke('client-management', {
        body: {
          action: 'create_client_user',
          data: {
            email: clientData.email,
            password: password,
            fullName: clientData.fullName
          }
        }
      });
      
      if (authError || !authData?.success) {
        throw new Error(authError?.message || authData?.error || "Failed to create client user");
      }
      
      // Convert client data to database format
      const dbClientData = {
        full_name: clientData.fullName,
        email: clientData.email,
        phone: clientData.phone,
        company_name: clientData.companyName,
        address: clientData.address,
        tags: clientData.tags,
        notes: clientData.notes,
        assigned_attorney_id: clientData.assignedAttorneyId,
        user_id: authData.user.user.id,
      };
      
      // Insert client record in database
      const { data: newDbClient, error } = await supabase
        .from('clients')
        .insert(dbClientData)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (newDbClient) {
        // Convert DB client back to frontend client model
        const newClient = mapDbClientToClient(newDbClient);
        
        // Update state
        setClients(prevClients => [newClient, ...prevClients]);
        setActiveTab("view");
        
        toast({
          title: "Client Added",
          description: `${newClient.fullName} has been added to your clients.`,
        });
        
        return newClient;
      } else {
        throw new Error("Failed to create client");
      }
    } catch (error: any) {
      console.error("Error adding client:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add client. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Edit client - memoized
  const handleEditClient = useCallback(async (clientData: Client): Promise<Client | null> => {
    try {
      // Check if password update is requested
      if (clientData.password && clientData.user_id) {
        // Update password using edge function
        const { data: passwordUpdateData, error: passwordUpdateError } = await supabase.functions.invoke('client-management', {
          body: {
            action: 'update_client_password',
            data: {
              userId: clientData.user_id,
              password: clientData.password
            }
          }
        });
        
        if (passwordUpdateError || !passwordUpdateData?.success) {
          toast({
            title: "Warning",
            description: "Client data was updated but password change failed.",
            variant: "warning",
          });
        }
      }
      
      // Convert to db format
      const dbClientData = {
        full_name: clientData.fullName,
        email: clientData.email,
        phone: clientData.phone,
        company_name: clientData.companyName,
        address: clientData.address,
        tags: clientData.tags,
        notes: clientData.notes,
        assigned_attorney_id: clientData.assignedAttorneyId,
      };
      
      // Update client record in database
      const { data: updatedDbClient, error } = await supabase
        .from('clients')
        .update(dbClientData)
        .eq('id', clientData.id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (updatedDbClient) {
        // Convert DB client back to frontend client model
        const updatedClient = mapDbClientToClient(updatedDbClient);
        
        // Update the appropriate list based on dropped status
        if (updatedClient.isDropped) {
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
          description: `${updatedClient.fullName}'s information has been updated.`,
        });
        
        return updatedClient;
      } else {
        throw new Error("Failed to update client");
      }
    } catch (error: any) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update client. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [selectedClient, toast]);

  // Drop client - memoized
  const handleDropClient = useCallback(async (clientId: string, reason: string): Promise<Client | null> => {
    try {
      const clientToDrop = clients.find(c => c.id === clientId);
      if (!clientToDrop) {
        throw new Error("Client not found");
      }
      
      const { data: updatedDbClient, error } = await supabase
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
      
      if (updatedDbClient) {
        // Convert DB client back to frontend client model
        const updatedClient = mapDbClientToClient(updatedDbClient);
        
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
          description: `${updatedClient.fullName} has been marked as dropped.`,
        });
        
        return updatedClient;
      } else {
        throw new Error("Failed to drop client");
      }
    } catch (error: any) {
      console.error("Error dropping client:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to drop client. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [clients, selectedClient, toast]);

  // Delete client - memoized
  const handleDeleteClient = useCallback(async (clientId: string): Promise<boolean> => {
    try {
      const clientToDelete = clients.find(c => c.id === clientId) || 
                           droppedClients.find(c => c.id === clientId);
                           
      if (!clientToDelete) {
        throw new Error("Client not found");
      }
      
      // If client has a user account, delete it
      if (clientToDelete.user_id) {
        const { data: authData, error: authError } = await supabase.functions.invoke('client-management', {
          body: {
            action: 'delete_client_user',
            data: {
              userId: clientToDelete.user_id,
            }
          }
        });
        
        if (authError || !authData?.success) {
          console.error("Error deleting client user account:", authError || authData?.error);
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
        description: `${clientToDelete.fullName} has been permanently removed.`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete client. Please try again.",
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
