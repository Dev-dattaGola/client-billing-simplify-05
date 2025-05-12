
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Define types for user creation
interface TestUser {
  email: string;
  password: string;
  role: string;
  first_name: string;
  last_name: string;
}

const testUsers: TestUser[] = [
  {
    email: 'admin@lyzlawfirm.com',
    password: 'admin123',
    role: 'admin',
    first_name: 'Admin',
    last_name: 'User'
  },
  {
    email: 'attorney@lyzlawfirm.com',
    password: 'attorney123',
    role: 'attorney',
    first_name: 'Attorney',
    last_name: 'User'
  },
  {
    email: 'client@example.com',
    password: 'client123',
    role: 'client',
    first_name: 'Client',
    last_name: 'User'
  }
];

Deno.serve(async (req) => {
  try {
    console.log("Creating test users for demo...");
    
    // Initialize Supabase client - use Deno.env for edge function
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? supabaseAnonKey;
    
    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey,
      { 
        auth: {
          persistSession: false
        }
      }
    );

    // Create each test user if they don't exist
    const results = [];
    
    for (const user of testUsers) {
      // Check if user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email);
      
      if (checkError) {
        console.error(`Error checking for existing user ${user.email}:`, checkError);
        results.push({ email: user.email, status: 'error', message: checkError.message });
        continue;
      }
      
      if (existingUsers && existingUsers.length > 0) {
        console.log(`User ${user.email} already exists, skipping...`);
        results.push({ email: user.email, status: 'skipped', message: 'User already exists' });
        continue;
      }
      
      // Create user with auth
      const { data: authData, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        }
      });
      
      if (createError) {
        console.error(`Error creating user ${user.email}:`, createError);
        results.push({ email: user.email, status: 'error', message: createError.message });
      } else {
        console.log(`Created user ${user.email} successfully`);
        results.push({ email: user.email, status: 'success' });
      }
    }

    return new Response(
      JSON.stringify({ message: "Test users creation process complete", results }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in test users function:", error);
    return new Response(
      JSON.stringify({ message: "Error creating test users", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
