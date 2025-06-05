
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';
import { CreateClientData, UpdateClientData } from './types';
import { ClientMapper } from './clientMapper';
import { toast } from 'sonner';

export class ClientCrudService {
  async getAllClients(): Promise<{ active: Client[]; dropped: Client[] }> {
    try {
      console.log("ClientCrudService: Fetching all clients");
      
      // First try to get from clients table
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!clientsError && clientsData && clientsData.length > 0) {
        console.log("ClientCrudService: Found data in clients table:", clientsData);
        const mappedClients = clientsData.map(client => ClientMapper.mapDbClientToClient(client));
        const active = mappedClients.filter(client => !client.isDropped);
        const dropped = mappedClients.filter(client => client.isDropped);
        return { active, dropped };
      }
      
      // Fallback to profiles table for client role users
      console.log("ClientCrudService: Trying profiles table as fallback");
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });
        
      if (profilesError) {
        console.error("ClientCrudService: Error fetching from profiles table:", profilesError);
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
      
      const mappedClients = convertedClients.map(client => ClientMapper.mapDbClientToClient(client));
      
      console.log("ClientCrudService: Mapped clients from profiles:", mappedClients);
      
      return { active: mappedClients, dropped: [] };
    } catch (error) {
      console.error("ClientCrudService: Failed to fetch clients:", error);
      toast.error("Failed to load client data");
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
      
      return dbClient ? ClientMapper.mapDbClientToClient(dbClient) : null;
    } catch (error) {
      console.error("ClientCrudService: Error fetching client:", error);
      return null;
    }
  }

  async updateClient(clientData: UpdateClientData): Promise<Client> {
    try {
      console.log("ClientCrudService: Updating client:", clientData);
      
      // Try to update in clients table first
      const { data: updatedDbClient, error: clientsError } = await supabase
        .from('clients')
        .update({
          full_name: clientData.fullName,
          email: clientData.email,
          phone: clientData.phone || '',
          company_name: clientData.companyName || '',
          address: clientData.address || '',
          tags: clientData.tags || [],
          notes: clientData.notes || '',
          assigned_attorney_id: clientData.assignedAttorneyId || null,
        })
        .eq('id', clientData.id)
        .select('*')
        .single();
      
      if (!clientsError && updatedDbClient) {
        const updatedClient = ClientMapper.mapDbClientToClient(updatedDbClient);
        toast.success(`${updatedClient.fullName} has been updated successfully`);
        return updatedClient;
      }
      
      // Fallback to profiles table
      const { data: updatedProfile, error: profilesError } = await supabase
        .from('profiles')
        .update({
          first_name: clientData.fullName?.split(' ')[0] || '',
          last_name: clientData.fullName?.split(' ').slice(1).join(' ') || '',
          email: clientData.email,
          phone: clientData.phone || '',
        })
        .eq('id', clientData.id)
        .select('*')
        .single();
      
      if (profilesError) {
        throw profilesError;
      }
      
      const updatedClient = ClientMapper.mapDbClientToClient({
        ...updatedProfile,
        full_name: `${updatedProfile.first_name || ''} ${updatedProfile.last_name || ''}`.trim(),
        company_name: clientData.companyName || '',
        address: clientData.address || '',
        tags: clientData.tags || [],
        notes: clientData.notes || '',
        assigned_attorney_id: clientData.assignedAttorneyId || null,
      });
      
      toast.success(`${updatedClient.fullName} has been updated successfully`);
      return updatedClient;
    } catch (error) {
      console.error("ClientCrudService: Error updating client:", error);
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
      
      const updatedClient = ClientMapper.mapDbClientToClient(updatedDbClient);
      toast.success(`${updatedClient.fullName} has been marked as dropped`);
      
      return updatedClient;
    } catch (error) {
      console.error("ClientCrudService: Error dropping client:", error);
      toast.error("Failed to drop client");
      throw error;
    }
  }

  async deleteClient(clientId: string): Promise<void> {
    try {
      const client = await this.getClientById(clientId);
      
      if (client?.user_id) {
        try {
          await supabase.functions.invoke('client-management', {
            body: {
              action: 'delete_client_user',
              data: { userId: client.user_id }
            }
          });
        } catch (authError) {
          console.warn("ClientCrudService: Auth user deletion failed:", authError);
        }
      }
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);
      
      if (error) throw error;
      
      toast.success(`${client?.fullName || 'Client'} has been permanently deleted`);
    } catch (error) {
      console.error("ClientCrudService: Error deleting client:", error);
      toast.error("Failed to delete client");
      throw error;
    }
  }
}
