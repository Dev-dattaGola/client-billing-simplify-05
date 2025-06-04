
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
      fullName: dbClient.full_name || '',
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

  // Convert frontend client to database format
  private mapClientToDbFormat(clientData: CreateClientData | UpdateClientData) {
    return {
      full_name: clientData.fullName,
      email: clientData.email,
      phone: clientData.phone || '',
      company_name: clientData.companyName || '',
      address: clientData.address || '',
      tags: clientData.tags || [],
      notes: clientData.notes || '',
      assigned_attorney_id: clientData.assignedAttorneyId || null,
    };
  }

  async getAllClients(): Promise<{ active: Client[]; dropped: Client[] }> {
    try {
      console.log("ClientService: Fetching all clients");
      
      const { data: fetchedClients, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("ClientService: Error fetching clients:", error);
        throw error;
      }
      
      console.log("ClientService: Raw clients data:", fetchedClients);
      
      const mappedClients = fetchedClients?.map(client => this.mapDbClientToClient(client)) || [];
      console.log("ClientService: Mapped clients:", mappedClients);
      
      const active = mappedClients.filter(client => !client.isDropped);
      const dropped = mappedClients.filter(client => client.isDropped);
      
      console.log(`ClientService: Returning ${active.length} active and ${dropped.length} dropped clients`);
      
      return { active, dropped };
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
          const { data: authData, error: authError } = await supabase.functions.invoke('client-management', {
            body: {
              action: 'create_client_user',
              data: {
                email: clientData.email,
                password: clientData.password,
                fullName: clientData.fullName
              }
            }
          });
          
          if (authData?.success) {
            userId = authData.user?.user?.id;
            console.log("ClientService: Created auth user with ID:", userId);
          } else {
            console.warn("ClientService: Auth user creation failed (continuing anyway):", authData?.error);
          }
        } catch (authError) {
          console.warn("ClientService: Auth user creation failed (continuing anyway):", authError);
        }
      }
      
      // Convert to database format
      const dbClientData = {
        ...this.mapClientToDbFormat(clientData),
        user_id: userId,
      };
      
      console.log("ClientService: Inserting client with mapped data:", dbClientData);
      
      const { data: newDbClient, error } = await supabase
        .from('clients')
        .insert(dbClientData)
        .select('*')
        .single();
      
      if (error) {
        console.error("ClientService: Database error:", error);
        throw error;
      }
      
      console.log("ClientService: Client created successfully:", newDbClient);
      
      const newClient = this.mapDbClientToClient(newDbClient);
      toast.success(`${newClient.fullName} has been added successfully`);
      
      return newClient;
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
      const dbClientData = this.mapClientToDbFormat(clientData);
      
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
