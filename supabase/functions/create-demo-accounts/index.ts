import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Demo account data
const DEMO_ACCOUNTS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'hospital_demo@clinibuilds.com',
    password: 'DemoPassword123!',
    full_name: 'Demo Hospital Admin',
    role: 'hospital',
    organization: 'City General Hospital'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'investor_demo@clinibuilds.com',
    password: 'DemoPassword123!',
    full_name: 'Demo Investor',
    role: 'investor',
    organization: 'MedTech Ventures'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'manufacturer_demo@clinibuilds.com',
    password: 'DemoPassword123!',
    full_name: 'Demo Manufacturer',
    role: 'manufacturer',
    organization: 'MedEquip Solutions'
  }
]

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Creating demo accounts...');

    for (const account of DEMO_ACCOUNTS) {
      try {
        // Create auth user
        const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
          email: account.email,
          password: account.password,
          user_metadata: {
            full_name: account.full_name,
            role: account.role,
            organization: account.organization
          },
          email_confirm: true
        });

        if (authError) {
          console.error(`Failed to create auth user for ${account.email}:`, authError);
          continue;
        }

        console.log(`Created auth user for ${account.email}`);

        // Update or create profile
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: account.email,
            full_name: account.full_name,
            role: account.role,
            organization: account.organization,
            bio: `Demo ${account.role} account for testing purposes`,
            location: account.role === 'hospital' ? 'New York, NY' : 
                     account.role === 'investor' ? 'San Francisco, CA' : 'Boston, MA',
            phone: account.role === 'hospital' ? '+1-555-0101' : 
                  account.role === 'investor' ? '+1-555-0102' : '+1-555-0103',
            last_active: new Date().toISOString()
          });

        if (profileError) {
          console.error(`Failed to create profile for ${account.email}:`, profileError);
        } else {
          console.log(`Created profile for ${account.email}`);
        }

      } catch (error) {
        console.error(`Error processing account ${account.email}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Demo accounts creation process completed',
        accounts: DEMO_ACCOUNTS.map(acc => ({ email: acc.email, role: acc.role }))
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Demo accounts creation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})