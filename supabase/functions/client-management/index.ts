
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
    
    const supabase = createClient(supabaseUrl, supabaseServiceRole, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { action, data } = await req.json();

    if (action === 'create_client_user') {
      // Create a new user in auth.users with the client role
      const { email, password, fullName } = data;
      
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
        throw error;
      }

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
      
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { password }
      );

      if (error) {
        throw error;
      }

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
      
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        throw error;
      }

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
