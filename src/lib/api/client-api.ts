
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';
import { toast } from '@/hooks/use-toast';

export const clientsApi = {
  // Get all clients
  getClients: async (): Promise<Client[]> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      return [];
    }
  },

  // Get client by ID
  getClient: async (id: string): Promise<Client | null> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching client:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch client:', error);
      return null;
    }
  },

  // Create a client with Supabase Auth and Client table
  createClient: async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> & { password?: string }): Promise<Client | null> => {
    try {
      // Create user in auth if password is provided
      let userId = null;

      if (clientData.password) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: clientData.email,
          password: clientData.password,
          options: {
            data: {
              first_name: clientData.fullName.split(' ')[0],
              last_name: clientData.fullName.split(' ').slice(1).join(' '),
              role: 'client'
            }
          }
        });

        if (authError) {
          console.error('Error creating auth user:', authError);
          toast({
            title: "Authentication Error",
            description: authError.message,
            variant: "destructive",
          });
          throw authError;
        }

        userId = authData.user?.id;
        console.log('Created auth user with ID:', userId);
      }

      // Create client record in clients table
      const { data: clientRecord, error: clientError } = await supabase
        .from('clients')
        .insert([
          {
            user_id: userId,
            full_name: clientData.fullName,
            email: clientData.email,
            phone: clientData.phone,
            company_name: clientData.companyName,
            address: clientData.address,
            notes: clientData.notes,
            tags: clientData.tags || []
          }
        ])
        .select()
        .single();

      if (clientError) {
        console.error('Error creating client record:', clientError);
        toast({
          title: "Database Error",
          description: clientError.message,
          variant: "destructive",
        });
        throw clientError;
      }

      // Convert Supabase client format to app Client format
      return {
        id: clientRecord.id,
        fullName: clientRecord.full_name,
        email: clientRecord.email,
        phone: clientRecord.phone || '',
        companyName: clientRecord.company_name || '',
        address: clientRecord.address || '',
        notes: clientRecord.notes || '',
        tags: clientRecord.tags || [],
        createdAt: clientRecord.created_at,
        updatedAt: clientRecord.updated_at
      };
    } catch (error) {
      console.error('Failed to create client:', error);
      return null;
    }
  },

  // Update client
  updateClient: async (id: string, clientData: Partial<Client>): Promise<Client | null> => {
    try {
      // Convert app Client format to Supabase format
      const supabaseData = {
        full_name: clientData.fullName,
        email: clientData.email,
        phone: clientData.phone,
        company_name: clientData.companyName,
        address: clientData.address,
        notes: clientData.notes,
        tags: clientData.tags,
        updated_at: new Date().toISOString()
      };

      const { data: updatedClient, error } = await supabase
        .from('clients')
        .update(supabaseData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating client:', error);
        throw error;
      }

      // Convert back to app Client format
      return {
        id: updatedClient.id,
        fullName: updatedClient.full_name,
        email: updatedClient.email,
        phone: updatedClient.phone || '',
        companyName: updatedClient.company_name || '',
        address: updatedClient.address || '',
        notes: updatedClient.notes || '',
        tags: updatedClient.tags || [],
        createdAt: updatedClient.created_at,
        updatedAt: updatedClient.updated_at
      };
    } catch (error) {
      console.error('Failed to update client:', error);
      return null;
    }
  },

  // Delete client
  deleteClient: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting client:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete client:', error);
      return false;
    }
  }
};
