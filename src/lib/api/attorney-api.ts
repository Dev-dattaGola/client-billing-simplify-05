
import { supabase } from '@/integrations/supabase/client';
import { Attorney } from '@/types/attorney';
import { toast } from '@/hooks/use-toast';

export const attorneysApi = {
  // Get all attorneys
  getAttorneys: async (): Promise<Attorney[]> => {
    try {
      const { data, error } = await supabase
        .from('attorneys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching attorneys:', error);
        throw error;
      }

      // Map Supabase data to Attorney type
      return (data || []).map(attorney => ({
        id: attorney.id,
        firstName: attorney.full_name.split(' ')[0],
        lastName: attorney.full_name.split(' ').slice(1).join(' '),
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
      }));
    } catch (error) {
      console.error('Failed to fetch attorneys:', error);
      return [];
    }
  },

  // Get attorney by ID
  getAttorney: async (id: string): Promise<Attorney | null> => {
    try {
      const { data, error } = await supabase
        .from('attorneys')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching attorney:', error);
        throw error;
      }

      if (!data) return null;

      // Map Supabase data to Attorney type
      return {
        id: data.id,
        firstName: data.full_name.split(' ')[0],
        lastName: data.full_name.split(' ').slice(1).join(' '),
        fullName: data.full_name,
        email: data.email,
        phone: data.phone || '',
        specialization: data.specialization || '',
        bio: data.bio || '',
        office_location: data.office_location || '',
        yearsOfExperience: data.years_of_experience || 0,
        isActive: true,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Failed to fetch attorney:', error);
      return null;
    }
  },

  // Create an attorney with Supabase Auth
  createAttorney: async (attorneyData: Partial<Attorney> & { password?: string }): Promise<Attorney | null> => {
    try {
      // Create user in auth if password is provided
      let userId = null;

      if (attorneyData.password) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: attorneyData.email || '',
          password: attorneyData.password,
          options: {
            data: {
              first_name: attorneyData.firstName || '',
              last_name: attorneyData.lastName || '',
              role: 'attorney'
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
        console.log('Created attorney auth user with ID:', userId);
      }

      // Create attorney record
      const fullName = `${attorneyData.firstName} ${attorneyData.lastName}`;
      
      const { data: attorneyRecord, error: attorneyError } = await supabase
        .from('attorneys')
        .insert([
          {
            user_id: userId,
            full_name: fullName,
            email: attorneyData.email,
            phone: attorneyData.phone,
            specialization: attorneyData.specialization,
            bio: attorneyData.bio,
            years_of_experience: attorneyData.yearsOfExperience,
            office_location: attorneyData.office_location
          }
        ])
        .select()
        .single();

      if (attorneyError) {
        console.error('Error creating attorney record:', attorneyError);
        toast({
          title: "Database Error",
          description: attorneyError.message,
          variant: "destructive",
        });
        throw attorneyError;
      }

      return {
        id: attorneyRecord.id,
        firstName: attorneyData.firstName || '',
        lastName: attorneyData.lastName || '',
        fullName: fullName,
        email: attorneyData.email || '',
        phone: attorneyData.phone || '',
        specialization: attorneyData.specialization || '',
        bio: attorneyData.bio || '',
        office_location: attorneyRecord.office_location || '',
        yearsOfExperience: attorneyData.yearsOfExperience || 0,
        isActive: true,
        createdAt: attorneyRecord.created_at,
        updatedAt: attorneyRecord.updated_at
      };
    } catch (error) {
      console.error('Failed to create attorney:', error);
      return null;
    }
  },

  // Update attorney
  updateAttorney: async (id: string, attorneyData: Partial<Attorney>): Promise<Attorney | null> => {
    try {
      const fullName = `${attorneyData.firstName} ${attorneyData.lastName}`;
      
      const { data: updatedAttorney, error } = await supabase
        .from('attorneys')
        .update({
          full_name: fullName,
          email: attorneyData.email,
          phone: attorneyData.phone,
          specialization: attorneyData.specialization,
          bio: attorneyData.bio,
          years_of_experience: attorneyData.yearsOfExperience,
          office_location: attorneyData.office_location,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating attorney:', error);
        throw error;
      }

      return {
        id: updatedAttorney.id,
        firstName: attorneyData.firstName || '',
        lastName: attorneyData.lastName || '',
        fullName: fullName,
        email: updatedAttorney.email,
        phone: updatedAttorney.phone || '',
        specialization: updatedAttorney.specialization || '',
        bio: updatedAttorney.bio || '',
        office_location: updatedAttorney.office_location || '',
        yearsOfExperience: updatedAttorney.years_of_experience || 0,
        isActive: true,
        createdAt: updatedAttorney.created_at,
        updatedAt: updatedAttorney.updated_at
      };
    } catch (error) {
      console.error('Failed to update attorney:', error);
      return null;
    }
  },

  // Delete attorney
  deleteAttorney: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('attorneys')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting attorney:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete attorney:', error);
      return false;
    }
  }
};
