
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensures test users exist in the database by calling the register-test-users edge function
 */
export const ensureTestUsers = async (): Promise<void> => {
  try {
    console.log("Ensuring test users exist in the database...");
    
    // Call the Supabase edge function to ensure test users exist
    const { data, error } = await supabase.functions.invoke('register-test-users');
    
    if (error) {
      console.error("Failed to ensure test users:", error);
      return;
    }
    
    console.log("Test users check complete:", data);
  } catch (error) {
    console.error("Error ensuring test users:", error);
  }
};
