
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
    // Get the request body
    const body = await req.json()
    const { fullName, email, password, phone, companyName, address, notes, tags } = body

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey
    )

    console.log(`Creating client: ${fullName} (${email})`)

    // Split name into first and last name
    const nameParts = fullName.split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ')

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role: 'client'
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      throw authError
    }

    const userId = authData.user.id
    console.log(`Created auth user with ID: ${userId}`)

    // Create client record
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert([
        {
          user_id: userId,
          full_name: fullName,
          email,
          phone,
          company_name: companyName,
          address,
          notes,
          tags
        }
      ])
      .select()
      .single()

    if (clientError) {
      console.error('Error creating client record:', clientError)
      throw clientError
    }

    console.log(`Created client record with ID: ${clientData.id}`)

    // Return the new user data
    return new Response(
      JSON.stringify({ 
        userId,
        clientId: clientData.id,
        message: 'Client registered successfully' 
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in register-client function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 400,
      },
    )
  }
})
