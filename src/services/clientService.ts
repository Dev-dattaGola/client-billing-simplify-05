import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';
import { toast } from 'sonner';

export interface CreateClientData {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  tags?: string[];
  notes?: string;
  assignedAttorneyId?: string;
  password?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  id: string;
}

class ClientService {
  // Helper function to convert database client to frontend client
  private mapDbClientToClient(dbClient: any): Client {
    return {
      id: dbClient.id,
      user_id: dbClient.user_id,
      fullName: dbClient.full_name || `${dbClient.first_name || ''} ${dbClient.last_name || ''}`.trim(),
      email: dbClient.email || '',
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
    };
  }

  async getAllClients(): Promise<{ active: Client[]; dropped: Client[] }> {
    try {
      console.log("ClientService: Fetching all clients");
      
      // Try clients table first
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!clientsError && clientsData) {
        console.log("ClientService: Found data in clients table:", clientsData);
        const mappedClients = clientsData.map(client => this.mapDbClientToClient(client));
        const active = mappedClients.filter(client => !client.isDropped);
        const dropped = mappedClients.filter(client => client.isDropped);
        return { active, dropped };
      }
      
      // Fallback to profiles table
      console.log("ClientService: Trying profiles table as fallback");
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });
        
      if (profilesError) {
        console.error("ClientService: Error fetching from profiles table:", profilesError);
        throw profilesError;
      }
      
      // Convert profiles data to client format
      const convertedClients = profilesData?.map(profile => ({
        id: profile.id,
        user_id: profile.id,
        full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        email: profile.email,
        phone: profile.phone || '',
        company_name: '',
        address: '',
        tags: [],
        notes: '',
        assigned_attorney_id: null,
        is_dropped: false,
        dropped_date: null,
        dropped_reason: '',
        created_at: profile.created_at,
        updated_at: profile.updated_at
      })) || [];
      
      const mappedClients = convertedClients.map(client => this.mapDbClientToClient(client));
      
      console.log("ClientService: Mapped clients from profiles:", mappedClients);
      
      return { active: mappedClients, dropped: [] };
    } catch (error) {
      console.error("ClientService: Failed to fetch clients:", error);
      toast.error("Failed to load client data");
      throw error;
    }
  }

  async createClient(clientData: CreateClientData): Promise<Client> {
    try {
      console.log("ClientService: Creating client with data:", clientData);
      
      let userId = null;
      
      // Try to create auth user if password is provided
      if (clientData.password) {
        try {
          console.log("ClientService: Creating auth user");
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: clientData.email,
            password: clientData.password,
            options: {
              data: {
                first_name: clientData.fullName.split(' ')[0] || '',
                last_name: clientData.fullName.split(' ').slice(1).join(' ') || '',
                role: 'client'
              }
            }
          });
          
          if (authData?.user) {
            userId = authData.user.id;
            console.log("ClientService: Created auth user with ID:", userId);
          } else {
            console.warn("ClientService: Auth user creation failed:", authError);
          }
        } catch (authError) {
          console.warn("ClientService: Auth user creation failed (continuing anyway):", authError);
        }
      }
      
      // Try to save to clients table first
      try {
        const clientDbData = {
          full_name: clientData.fullName,
          email: clientData.email,
          phone: clientData.phone || '',
          company_name: clientData.companyName || '',
          address: clientData.address || '',
          tags: clientData.tags || [],
          notes: clientData.notes || '',
          assigned_attorney_id: clientData.assignedAttorneyId || null,
          user_id: userId,
        };
        
        console.log("ClientService: Inserting to clients table:", clientDbData);
        
        const { data: newDbClient, error } = await supabase
          .from('clients')
          .insert(clientDbData)
          .select('*')
          .single();
        
        if (!error && newDbClient) {
          console.log("ClientService: Client created successfully in clients table:", newDbClient);
          const newClient = this.mapDbClientToClient(newDbClient);
          toast.success(`${newClient.fullName} has been added successfully`);
          return newClient;
        }
        
        console.warn("ClientService: Failed to save to clients table:", error);
      } catch (clientsTableError) {
        console.warn("ClientService: Clients table insert failed:", clientsTableError);
      }
      
      // If clients table fails and we have a userId, the profile should already be created by the auth trigger
      if (userId) {
        console.log("ClientService: Fetching created profile for user:", userId);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (!profileError && profileData) {
          console.log("ClientService: Found created profile:", profileData);
          const newClient = this.mapDbClientToClient({
            id: profileData.id,
            user_id: profileData.id,
            full_name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
            email: profileData.email,
            phone: profileData.phone || '',
            company_name: '',
            address: '',
            tags: [],
            notes: '',
            assigned_attorney_id: null,
            is_dropped: false,
            dropped_date: null,
            dropped_reason: '',
            created_at: profileData.created_at,
            updated_at: profileData.updated_at
          });
          
          toast.success(`${newClient.fullName} has been added successfully`);
          return newClient;
        }
      }
      
      throw new Error("Failed to create client in both clients and profiles tables");
    } catch (error) {
      console.error("ClientService: Error creating client:", error);
      toast.error("Failed to create client");
      throw error;
    }
  }

  async updateClient(clientData: UpdateClientData): Promise<Client> {
    try {
      console.log("ClientService: Updating client:", clientData);
      
      // Handle password update if provided
      if (clientData.password && clientData.id) {
        const client = await this.getClientById(clientData.id);
        if (client?.user_id) {
          try {
            await supabase.functions.invoke('client-management', {
              body: {
                action: 'update_client_password',
                data: {
                  userId: client.user_id,
                  password: clientData.password
                }
              }
            });
          } catch (passwordError) {
            console.warn("ClientService: Password update failed:", passwordError);
          }
        }
      }
      
      // Convert to database format
      const dbClientData = {
        full_name: clientData.fullName,
        email: clientData.email,
        phone: clientData.phone || '',
        company_name: clientData.companyName || '',
        address: clientData.address || '',
        tags: clientData.tags || [],
        notes: clientData.notes || '',
        assigned_attorney_id: clientData.assignedAttorneyId || null,
      };
      
      console.log("ClientService: Updating with mapped data:", dbClientData);
      
      const { data: updatedDbClient, error } = await supabase
        .from('clients')
        .update(dbClientData)
        .eq('id', clientData.id)
        .select('*')
        .single();
      
      if (error) {
        console.error("ClientService: Update error:", error);
        throw error;
      }
      
      const updatedClient = this.mapDbClientToClient(updatedDbClient);
      toast.success(`${updatedClient.fullName} has been updated successfully`);
      
      return updatedClient;
    } catch (error) {
      console.error("ClientService: Error updating client:", error);
      toast.error("Failed to update client");
      throw error;
    }
  }

  async dropClient(clientId: string, reason: string): Promise<Client> {
    try {
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
      
      const updatedClient = this.mapDbClientToClient(updatedDbClient);
      toast.success(`${updatedClient.fullName} has been marked as dropped`);
      
      return updatedClient;
    } catch (error) {
      console.error("ClientService: Error dropping client:", error);
      toast.error("Failed to drop client");
      throw error;
    }
  }

  async deleteClient(clientId: string): Promise<void> {
    try {
      // Get client info for user deletion
      const client = await this.getClientById(clientId);
      
      // Delete auth user if exists
      if (client?.user_id) {
        try {
          await supabase.functions.invoke('client-management', {
            body: {
              action: 'delete_client_user',
              data: { userId: client.user_id }
            }
          });
        } catch (authError) {
          console.warn("ClientService: Auth user deletion failed:", authError);
        }
      }
      
      // Delete client record
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);
      
      if (error) throw error;
      
      toast.success(`${client?.fullName || 'Client'} has been permanently deleted`);
    } catch (error) {
      console.error("ClientService: Error deleting client:", error);
      toast.error("Failed to delete client");
      throw error;
    }
  }

  async getClientById(clientId: string): Promise<Client | null> {
    try {
      const { data: dbClient, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .maybeSingle();
      
      if (error) throw error;
      
      return dbClient ? this.mapDbClientToClient(dbClient) : null;
    } catch (error) {
      console.error("ClientService: Error fetching client:", error);
      return null;
    }
  }
}

export const clientService = new ClientService();
