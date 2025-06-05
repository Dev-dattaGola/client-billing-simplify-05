
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';
import { CreateClientData } from './types';
import { ClientMapper } from './clientMapper';
import { toast } from 'sonner';

export class ClientCreationService {
  async createClient(clientData: CreateClientData): Promise<Client> {
    try {
      console.log("ClientCreationService: Creating client with data:", clientData);
      
      // Always create a client record, with or without auth user
      const clientRecord = {
        user_id: null, // Will be set if auth user is created
        full_name: clientData.fullName,
        email: clientData.email,
        phone: clientData.phone || '',
        company_name: clientData.companyName || '',
        address: clientData.address || '',
        tags: clientData.tags || [],
        notes: clientData.notes || '',
        assigned_attorney_id: clientData.assignedAttorneyId || null,
        is_dropped: false,
        dropped_date: null,
        dropped_reason: ''
      };

      // Try to create auth user if password is provided
      if (clientData.password) {
        try {
          console.log("ClientCreationService: Creating auth user");
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
            clientRecord.user_id = authData.user.id;
            console.log("ClientCreationService: Created auth user with ID:", authData.user.id);
          } else {
            console.warn("ClientCreationService: Auth user creation failed:", authError);
          }
        } catch (authError) {
          console.warn("ClientCreationService: Auth user creation failed, proceeding without auth:", authError);
        }
      }
      
      console.log("ClientCreationService: Inserting client record:", clientRecord);
      
      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert(clientRecord)
        .select('*')
        .single();
      
      if (insertError) {
        console.error("ClientCreationService: Error inserting client:", insertError);
        throw insertError;
      }
      
      if (!newClient) {
        throw new Error("Failed to create client - no data returned");
      }
      
      console.log("ClientCreationService: Client created successfully:", newClient);
      
      const mappedClient = ClientMapper.mapDbClientToClient(newClient);
      toast.success(`${mappedClient.fullName} has been added successfully`);
      
      return mappedClient;
    } catch (error) {
      console.error("ClientCreationService: Error creating client:", error);
      toast.error("Failed to create client. Please try again.");
      throw error;
    }
  }
}
