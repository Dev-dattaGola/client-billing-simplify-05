
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.29.0'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey
    )

    console.log('Creating test users for demo...');

    // Define the test users we want to create
    const testUsers = [
      {
        email: 'admin@lyzlawfirm.com',
        password: 'admin123',
        userMetadata: {
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin'
        }
      },
      {
        email: 'attorney@lyzlawfirm.com',
        password: 'attorney123',
        userMetadata: {
          first_name: 'Attorney',
          last_name: 'User',
          role: 'attorney'
        }
      },
      {
        email: 'client@example.com',
        password: 'client123',
        userMetadata: {
          first_name: 'Client',
          last_name: 'User',
          role: 'client'
        }
      }
    ];

    const results = [];
    
    // Create each test user
    for (const user of testUsers) {
      try {
        // Check if the user already exists
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.email)
          .single();

        if (existingUser) {
          console.log(`User ${user.email} already exists, skipping...`);
          results.push({ email: user.email, status: 'already exists' });
          continue;
        }

        // Create auth user with auto-confirmation
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true, // Auto-confirm the email
          user_metadata: user.userMetadata
        });

        if (authError) {
          console.error(`Error creating user ${user.email}:`, authError);
          results.push({ email: user.email, status: 'error', message: authError.message });
          continue;
        }

        console.log(`Created user ${user.email} with ID: ${authData.user.id}`);
        
        // Profiles table should be updated automatically via trigger, but we'll ensure it
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();
          
        if (!profileData) {
          // Insert profile manually if not created by trigger
          const { data: newProfile, error: newProfileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                email: user.email,
                first_name: user.userMetadata.first_name,
                last_name: user.userMetadata.last_name,
                role: user.userMetadata.role
              }
            ]);
            
          if (newProfileError) {
            console.error(`Error creating profile for ${user.email}:`, newProfileError);
          }
        }
        
        // Create corresponding record in the appropriate role table
        if (user.userMetadata.role === 'client') {
          const { error: clientError } = await supabase
            .from('clients')
            .insert([
              {
                user_id: authData.user.id,
                email: user.email,
                full_name: `${user.userMetadata.first_name} ${user.userMetadata.last_name}`,
                phone: '+1234567890',
                company_name: 'Demo Company'
              }
            ]);
            
          if (clientError) {
            console.error(`Error creating client record for ${user.email}:`, clientError);
          }
        } else if (user.userMetadata.role === 'attorney') {
          const { error: attorneyError } = await supabase
            .from('attorneys')
            .insert([
              {
                user_id: authData.user.id,
                email: user.email,
                full_name: `${user.userMetadata.first_name} ${user.userMetadata.last_name}`,
                phone: '+1987654321',
                specialization: 'Personal Injury',
                years_of_experience: 5
              }
            ]);
            
          if (attorneyError) {
            console.error(`Error creating attorney record for ${user.email}:`, attorneyError);
          }
        }
        
        results.push({ email: user.email, status: 'created', userId: authData.user.id });
      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error);
        results.push({ email: user.email, status: 'error', message: error.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Test users registration process completed',
        results 
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in register-test-users function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500,
      },
    );
  }
})
