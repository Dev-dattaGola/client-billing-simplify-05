import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';
import { Attorney } from '@/types/attorney';
import { toast } from 'sonner';

// Define additional types needed by the components
export interface Appointment {
  id: string;
  clientId: string;
  patientId?: string; // Added for compatibility with Patient interface
  doctorFacilityName: string;
  visitDate: string;
  visitTime: string;
  visitStatus: 'completed' | 'missed' | 'scheduled';
  treatmentDescription?: string;
  location: string;
  type: string;
}

export interface Document {
  id: string;
  clientId: string;
  patientId?: string; // Added for compatibility with Patient interface
  name: string;
  type: 'medical' | 'legal' | 'billing' | 'misc';
  category: string;
  uploadDate: string;
  fileType: string;
  url: string;
  uploadedBy: string;
}

export interface Communication {
  id: string;
  clientId: string;
  patientId?: string; // Added for compatibility with Patient interface
  date: string;
  time: string;
  type: 'email' | 'sms' | 'phone';
  sender: string;
  subject: string;
  content: string;
  read: boolean;
  actionRequired: boolean;
}

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

      // Convert snake_case to camelCase
      return data?.map(client => ({
        id: client.id,
        fullName: client.full_name,
        email: client.email,
        phone: client.phone || '',
        companyName: client.company_name || '',
        address: client.address || '',
        notes: client.notes || '',
        tags: client.tags || [],
        isDropped: client.is_dropped || false,
        droppedDate: client.dropped_date || null,
        droppedReason: client.dropped_reason || '',
        assignedAttorneyId: client.assigned_attorney_id || '',
        createdAt: client.created_at,
        updatedAt: client.updated_at,
        // Extended properties with default values
        accountNumber: `A${client.id.substring(0, 3)}`,
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
        dateRegistered: client.created_at?.split('T')[0] || ''
      })) || [];
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      return [];
    }
  },

  // Get all attorneys
  getAttorneys: async (): Promise<Attorney[]> => {
    try {
      const { data, error } = await supabase
        .from('attorneys')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) {
        console.error('Error fetching attorneys:', error);
        throw error;
      }

      // Convert snake_case to camelCase
      return data?.map(attorney => ({
        id: attorney.id,
        firstName: attorney.full_name.split(' ')[0] || '',
        lastName: attorney.full_name.split(' ').slice(1).join(' ') || '',
        fullName: attorney.full_name,
        email: attorney.email,
        phone: attorney.phone || '',
        specialization: attorney.specialization || '',
        bio: attorney.bio || '',
        office_location: attorney.office_location || '',
        yearsOfExperience: attorney.years_of_experience || 0,
        isActive: true,
        createdAt: attorney.created_at,
        updatedAt: attorney.updated_at
      })) || [];
    } catch (error) {
      console.error('Failed to fetch attorneys:', error);
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

      if (!data) return null;

      return {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        phone: data.phone || '',
        companyName: data.company_name || '',
        address: data.address || '',
        notes: data.notes || '',
        tags: data.tags || [],
        isDropped: data.is_dropped || false,
        droppedDate: data.dropped_date || null,
        droppedReason: data.dropped_reason || '',
        assignedAttorneyId: data.assigned_attorney_id || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        // Extended properties with default values
        accountNumber: `A${data.id.substring(0, 3)}`,
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
        dateRegistered: data.created_at?.split('T')[0] || ''
      };
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
          toast.error(authError.message);
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
        toast.error(clientError.message);
        throw clientError;
      }

      // Return formatted client data
      return {
        id: clientRecord.id,
        fullName: clientRecord.full_name,
        email: clientRecord.email,
        phone: clientRecord.phone || '',
        companyName: clientRecord.company_name || '',
        address: clientRecord.address || '',
        notes: clientRecord.notes || '',
        tags: clientRecord.tags || [],
        isDropped: false,
        assignedAttorneyId: '',
        createdAt: clientRecord.created_at,
        updatedAt: clientRecord.updated_at,
        accountNumber: `A${clientRecord.id.substring(0, 3)}`,
        dateRegistered: clientRecord.created_at?.split('T')[0] || ''
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
      const supabaseData: Record<string, any> = {
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
        isDropped: updatedClient.is_dropped || false,
        droppedDate: updatedClient.dropped_date || null,
        droppedReason: updatedClient.dropped_reason || '',
        assignedAttorneyId: updatedClient.assigned_attorney_id || '',
        createdAt: updatedClient.created_at,
        updatedAt: updatedClient.updated_at,
        accountNumber: `A${updatedClient.id.substring(0, 3)}`,
        dateRegistered: updatedClient.created_at?.split('T')[0] || ''
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
  },

  // Drop client
  dropClient: async (id: string, reason: string): Promise<Client | null> => {
    try {
      const now = new Date().toISOString();
      
      const { data: updatedClient, error } = await supabase
        .from('clients')
        .update({
          is_dropped: true,
          dropped_date: now,
          dropped_reason: reason,
          updated_at: now
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error dropping client:', error);
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
        isDropped: updatedClient.is_dropped,
        droppedDate: updatedClient.dropped_date,
        droppedReason: updatedClient.dropped_reason,
        assignedAttorneyId: updatedClient.assigned_attorney_id || '',
        createdAt: updatedClient.created_at,
        updatedAt: updatedClient.updated_at,
        accountNumber: `A${updatedClient.id.substring(0, 3)}`,
        dateRegistered: updatedClient.created_at?.split('T')[0] || ''
      };
    } catch (error) {
      console.error('Failed to drop client:', error);
      return null;
    }
  },

  // Transfer client to another attorney
  transferClient: async (id: string, newAttorneyId: string): Promise<Client | null> => {
    try {
      const now = new Date().toISOString();
      
      const { data: updatedClient, error } = await supabase
        .from('clients')
        .update({
          assigned_attorney_id: newAttorneyId,
          updated_at: now
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error transferring client:', error);
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
        isDropped: updatedClient.is_dropped || false,
        droppedDate: updatedClient.dropped_date || null,
        droppedReason: updatedClient.dropped_reason || '',
        assignedAttorneyId: updatedClient.assigned_attorney_id,
        createdAt: updatedClient.created_at,
        updatedAt: updatedClient.updated_at,
        accountNumber: `A${updatedClient.id.substring(0, 3)}`,
        dateRegistered: updatedClient.created_at?.split('T')[0] || ''
      };
    } catch (error) {
      console.error('Failed to transfer client:', error);
      return null;
    }
  },

  // Mock implementations of additional required methods to fix type errors
  getAppointments: async (clientId: string): Promise<Appointment[]> => {
    console.log(`Getting appointments for client: ${clientId}`);
    // Return mock data for now
    return [
      {
        id: `apt-${Date.now()}-1`,
        clientId,
        doctorFacilityName: 'Dr. Michael Johnson',
        visitDate: '2025-05-10',
        visitTime: '10:30 AM',
        visitStatus: 'scheduled',
        treatmentDescription: 'Follow-up consultation',
        location: 'PT Associates',
        type: 'Physical Therapy'
      },
      {
        id: `apt-${Date.now()}-2`,
        clientId,
        doctorFacilityName: 'Dr. Michael Johnson',
        visitDate: '2025-04-25',
        visitTime: '2:00 PM',
        visitStatus: 'completed',
        treatmentDescription: 'Physical Therapy Session',
        location: 'PT Associates',
        type: 'Physical Therapy'
      }
    ];
  },

  // ... keep existing code (getAppointmentsByStatus, getDocuments, etc.)
  getAppointmentsByStatus: async (clientId: string, status: string): Promise<Appointment[]> => {
    const appointments = await clientsApi.getAppointments(clientId);
    return appointments.filter(apt => apt.visitStatus === status);
  },

  getDocuments: async (clientId: string): Promise<Document[]> => {
    console.log(`Getting documents for client: ${clientId}`);
    // Return mock data for now
    return [
      {
        id: `doc-${Date.now()}-1`,
        clientId,
        name: 'Initial Medical Evaluation',
        type: 'medical',
        category: 'Medical Reports',
        uploadDate: '2025-04-05',
        fileType: 'pdf',
        url: '/documents/initial-evaluation.pdf',
        uploadedBy: 'Dr. Smith'
      },
      {
        id: `doc-${Date.now()}-2`,
        clientId,
        name: 'Letter of Protection',
        type: 'legal',
        category: 'Legal Documents',
        uploadDate: '2025-04-06',
        fileType: 'pdf',
        url: '/documents/lop.pdf',
        uploadedBy: 'Jane Doelawyer'
      }
    ];
  },

  getDocumentsByType: async (clientId: string, type: string): Promise<Document[]> => {
    const documents = await clientsApi.getDocuments(clientId);
    return documents.filter(doc => doc.type === type);
  },

  getCommunications: async (clientId: string): Promise<Communication[]> => {
    console.log(`Getting communications for client: ${clientId}`);
    // Return mock data for now
    return [
      {
        id: `comm-${Date.now()}-1`,
        clientId,
        date: '2025-04-20',
        time: '10:15 AM',
        type: 'email',
        sender: 'Jane Doelawyer',
        subject: 'Case Update - Treatment Progress',
        content: 'Your case is progressing as expected. Please continue to attend all appointments.',
        read: true,
        actionRequired: false
      },
      {
        id: `comm-${Date.now()}-2`,
        clientId,
        date: '2025-04-18',
        time: '2:45 PM',
        type: 'phone',
        sender: 'Jane Doelawyer',
        subject: 'Missed Appointment Follow-up',
        content: 'Call to discuss the missed physical therapy appointment.',
        read: false,
        actionRequired: true
      }
    ];
  },

  markCommunicationAsRead: async (communicationId: string): Promise<Communication | null> => {
    console.log(`Marking communication as read: ${communicationId}`);
    // Mock implementation
    return {
      id: communicationId,
      clientId: 'mock-client-id',
      date: '2025-04-20',
      time: '10:15 AM',
      type: 'email',
      sender: 'Jane Doelawyer',
      subject: 'Case Update',
      content: 'Your case is progressing as expected.',
      read: true,
      actionRequired: false
    };
  },

  getMissedAppointmentsCount: async (clientId: string): Promise<number> => {
    console.log(`Getting missed appointment count for client: ${clientId}`);
    // Mock implementation
    return 1;
  },

  getUpcomingAppointment: async (clientId: string): Promise<Appointment | null> => {
    console.log(`Getting upcoming appointment for client: ${clientId}`);
    // Mock implementation
    return {
      id: `apt-${Date.now()}`,
      clientId,
      doctorFacilityName: 'Dr. Michael Johnson',
      visitDate: '2025-05-10',
      visitTime: '10:30 AM',
      visitStatus: 'scheduled',
      treatmentDescription: 'Follow-up consultation',
      location: 'PT Associates',
      type: 'Physical Therapy'
    };
  },

  getLastDocumentUploaded: async (clientId: string): Promise<Document | null> => {
    console.log(`Getting last document uploaded for client: ${clientId}`);
    // Mock implementation
    return {
      id: `doc-${Date.now()}`,
      clientId,
      name: 'Initial Medical Evaluation',
      type: 'medical',
      category: 'Medical Reports',
      uploadDate: '2025-04-05',
      fileType: 'pdf',
      url: '/documents/initial-evaluation.pdf',
      uploadedBy: 'Dr. Smith'
    };
  },

  getSmartNotifications: async (clientId: string): Promise<string[]> => {
    console.log(`Getting smart notifications for client: ${clientId}`);
    // Mock implementation
    return [
      'You have a scheduled appointment on May 10, 2025 at 10:30 AM.',
      'There are documents waiting for your review.'
    ];
  }
};
