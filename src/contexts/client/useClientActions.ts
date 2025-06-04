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
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("view");
  const [activeDetailTab, setActiveDetailTab] = useState("overview");
  const { toast } = useToast();

  // Helper function to convert database client to frontend client
  const mapDbClientToClient = (dbClient: any): Client => ({
    id: dbClient.id,
    user_id: dbClient.user_id,
    fullName: dbClient.full_name,
    email: dbClient.email,
    phone: dbClient.phone || '',
    companyName: dbClient.company_name || '',
    address: dbClient.address || '',
    tags: dbClient.tags || [],
    notes: dbClient.notes || '',
    assignedAttorneyId: dbClient.assigned_attorney_id || '',
    isDropped: dbClient.is_dropped || false,
    droppedDate: dbClient.dropped_date,
    droppedReason: dbClient.dropped_reason || '',
    createdAt: dbClient.created_at,
    updatedAt: dbClient.updated_at,
    
    // Extended properties with defaults
    accountNumber: `A${dbClient.id?.substring(0, 3) || '001'}`,
    dateOfBirth: '',
    profilePhoto: '',
    caseStatus: 'Initial Consultation',
    accidentDate: '',
    accidentLocation: '',
    injuryType: '',
    caseDescription: '',
    insuranceCompany: '',
    insurancePolicyNumber: '',
    insuranceAdjusterName: '',
    dateRegistered: dbClient.created_at?.split('T')[0] || ''
  });

  // Refresh clients - memoized
  const refreshClients = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching clients from Supabase");
      
      // Fetch from Supabase
      const { data: fetchedClients, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching clients:", error);
        throw error;
      }
      
      console.log("Raw clients data from Supabase:", fetchedClients);
      
      // Map database objects to client objects with proper camelCase properties
      const mappedClients = fetchedClients?.map(mapDbClientToClient) || [];
      
      // Separate active and dropped clients
      const active = mappedClients.filter(client => !client.isDropped);
      const dropped = mappedClients.filter(client => client.isDropped);
      
      setClients(active);
      setDroppedClients(dropped);
      console.log(`Loaded ${active.length} active clients and ${dropped.length} dropped clients`);
      
      return true;
    } catch (error) {
      console.error("Failed to fetch clients:", error);
      toast({
        title: "Error",
        description: "Failed to load client data. Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Add client with optional auth user creation - memoized
  const handleAddClient = useCallback(async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client | null> => {
    try {
      setLoading(true);
      console.log("Adding client:", clientData);
      
      // Extract password for auth user creation
      const password = clientData.password as string;
      let userId = clientData.user_id;
      
      // Try to create auth user if password is provided, but don't fail if it already exists
      if (password && !userId) {
        console.log("Attempting to create auth user for client");
        
        try {
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
          
          if (authError) {
            console.warn("Auth error (continuing anyway):", authError);
          } else if (authData?.success) {
            userId = authData.user?.user?.id;
            console.log("Created auth user with ID:", userId);
          } else {
            console.warn("Auth API returned no success (continuing anyway):", authData?.error);
          }
        } catch (authError) {
          console.warn("Auth user creation failed (continuing anyway):", authError);
          // Continue without user account - client will be created but won't have login access
        }
      }
      
      // Convert client data to database format
      const dbClientData = {
        full_name: clientData.fullName,
        email: clientData.email,
        phone: clientData.phone || '',
        company_name: clientData.companyName || '',
        address: clientData.address || '',
        tags: clientData.tags || [],
        notes: clientData.notes || '',
        assigned_attorney_id: clientData.assignedAttorneyId || null,
        user_id: userId || null,
      };
      
      console.log("Inserting client to database:", dbClientData);
      
      // Insert client record in database
      const { data: newDbClient, error } = await supabase
        .from('clients')
        .insert(dbClientData)
        .select('*')
        .single();
      
      if (error) {
        console.error("DB error:", error);
        throw error;
      }
      
      console.log("Client saved successfully:", newDbClient);
      
      if (newDbClient) {
        // Convert DB client back to frontend client model
        const newClient = mapDbClientToClient(newDbClient);
        
        // Update state
        setClients(prevClients => [newClient, ...prevClients]);
        
        // Refresh the client list to ensure we have the latest data
        await refreshClients();
        
        toast({
          title: "Success",
          description: `${newClient.fullName} has been added to your clients.`,
        });
        
        return newClient;
      } else {
        throw new Error("Failed to create client - no data returned");
      }
    } catch (error: any) {
      console.error("Error adding client:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add client. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, refreshClients]);

  // Edit client - memoized
  const handleEditClient = useCallback(async (clientData: Client): Promise<Client | null> => {
    try {
      setLoading(true);
      console.log("Editing client:", clientData);
      
      // Check if password update is requested
      if (clientData.password && clientData.user_id) {
        // Update password using edge function
        console.log("Updating password for user:", clientData.user_id);
        const { data: passwordUpdateData, error: passwordUpdateError } = await supabase.functions.invoke('client-management', {
          body: {
            action: 'update_client_password',
            data: {
              userId: clientData.user_id,
              password: clientData.password
            }
          }
        });
        
        if (passwordUpdateError) {
          console.error("Password update error:", passwordUpdateError);
          toast({
            title: "Warning",
            description: "Client data was updated but password change failed.",
            variant: "default",
          });
        } else if (!passwordUpdateData?.success) {
          console.error("Password API error:", passwordUpdateData?.error);
          toast({
            title: "Warning",
            description: "Client data was updated but password change failed.",
            variant: "default",
          });
        } else {
          console.log("Password updated successfully");
        }
      }
      
      // Convert to db format
      const dbClientData = {
        full_name: clientData.fullName,
        email: clientData.email,
        phone: clientData.phone,
        company_name: clientData.companyName,
        address: clientData.address,
        tags: clientData.tags || [],
        notes: clientData.notes,
        assigned_attorney_id: clientData.assignedAttorneyId,
      };
      
      console.log("Updating client in database:", dbClientData);
      
      // Update client record in database
      const { data: updatedDbClient, error } = await supabase
        .from('clients')
        .update(dbClientData)
        .eq('id', clientData.id)
        .select('*')
        .single();
      
      if (error) {
        console.error("DB update error:", error);
        throw error;
      }
      
      console.log("Client updated successfully:", updatedDbClient);
      
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
        }
        
        setClientToEdit(null);
        toast({
          title: "Client Updated",
          description: `${updatedClient.fullName}'s information has been updated.`,
        });
        
        return updatedClient;
      } else {
        throw new Error("Failed to update client - no data returned");
      }
    } catch (error: any) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update client. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
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
    setActiveTab,
    setActiveDetailTab,
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
