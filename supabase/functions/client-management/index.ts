
// Follow Deno's permissions for security
// @ts-ignore
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key - needed for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseServiceRole) {
      throw new Error("Missing Supabase credentials");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceRole, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Parse request body
    const { action, data } = await req.json();
    console.log(`Executing action: ${action} with data:`, data);

    if (action === 'create_client_user') {
      // Create a new user in auth.users with the client role
      const { email, password, fullName } = data;
      
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      console.log(`Creating new client user with email: ${email}`);
      
      const { data: user, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          role: 'client'
        }
      });

      if (error) {
        console.error("Error creating user:", error);
        throw error;
      }

      console.log("User created successfully:", user.user.id);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          user: user, 
          message: 'Client user created successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    else if (action === 'update_client_password') {
      // Update an existing user's password
      const { userId, password } = data;
      
      if (!userId || !password) {
        throw new Error("User ID and password are required");
      }
      
      console.log(`Updating password for user: ${userId}`);
      
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { password }
      );

      if (error) {
        console.error("Error updating password:", error);
        throw error;
      }

      console.log("Password updated successfully");
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Client password updated successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    else if (action === 'delete_client_user') {
      // Delete a user from auth.users
      const { userId } = data;
      
      if (!userId) {
        throw new Error("User ID is required");
      }
      
      console.log(`Deleting user: ${userId}`);
      
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        console.error("Error deleting user:", error);
        throw error;
      }

      console.log("User deleted successfully");
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Client user deleted successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    else {
      throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error:', error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
