import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Demo account credentials
const DEMO_ACCOUNTS = {
  'hospital': {
    email: 'hospital_demo@clinibuilds.com',
    password: 'DemoPassword123!',
    role: 'hospital',
    name: 'Demo Hospital Admin'
  },
  'investor': {
    email: 'investor_demo@clinibuilds.com', 
    password: 'DemoPassword123!',
    role: 'investor',
    name: 'Demo Investor'
  },
  'manufacturer': {
    email: 'manufacturer_demo@clinibuilds.com',
    password: 'DemoPassword123!', 
    role: 'manufacturer',
    name: 'Demo Manufacturer'
  }
}

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

    const { role } = await req.json()
    
    if (!role || !DEMO_ACCOUNTS[role as keyof typeof DEMO_ACCOUNTS]) {
      return new Response(
        JSON.stringify({ error: 'Invalid role specified' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const demoAccount = DEMO_ACCOUNTS[role as keyof typeof DEMO_ACCOUNTS]

    // Try to sign in first
    let { data: sessionData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email: demoAccount.email,
      password: demoAccount.password,
    })

    // If login fails, try to create the account
    if (authError && authError.message.includes('Invalid login credentials')) {
      console.log(`Demo account doesn't exist, creating: ${demoAccount.email}`)
      
      // Create the demo account
      const { data: createData, error: createError } = await supabaseClient.auth.admin.createUser({
        email: demoAccount.email,
        password: demoAccount.password,
        user_metadata: {
          full_name: demoAccount.name,
          role: demoAccount.role
        },
        email_confirm: true
      })

      if (createError) {
        console.error('Failed to create demo account:', createError)
        return new Response(
          JSON.stringify({ error: 'Failed to create demo account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create profile for the demo account
      if (createData.user) {
        await supabaseClient.from('profiles').upsert({
          id: createData.user.id,
          email: demoAccount.email,
          full_name: demoAccount.name,
          role: demoAccount.role,
          organization: demoAccount.role === 'hospital' ? 'City General Hospital' : 
                       demoAccount.role === 'investor' ? 'MedTech Ventures' : 'MedEquip Solutions',
          bio: `Demo ${demoAccount.role} account for testing purposes`,
          location: demoAccount.role === 'hospital' ? 'New York, NY' : 
                   demoAccount.role === 'investor' ? 'San Francisco, CA' : 'Boston, MA',
          phone: demoAccount.role === 'hospital' ? '+1-555-0101' : 
                demoAccount.role === 'investor' ? '+1-555-0102' : '+1-555-0103',
          last_active: new Date().toISOString()
        })
      }

      // Now try to sign in again
      const signInResult = await supabaseClient.auth.signInWithPassword({
        email: demoAccount.email,
        password: demoAccount.password,
      })

      sessionData = signInResult.data
      authError = signInResult.error
    }

    if (authError) {
      console.error('Demo auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Failed to create demo session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log the demo session creation
    if (sessionData.user) {
      await supabaseClient.rpc('log_audit_event', {
        action_param: 'DEMO_SESSION_CREATED',
        resource_type_param: 'demo_session',
        resource_id_param: sessionData.user.id,
        new_values_param: {
          demo_role: role,
          session_id: sessionData.session?.access_token?.substring(0, 10) + '...'
        }
      })
    }

    return new Response(
      JSON.stringify({
        session: sessionData.session,
        user: sessionData.user,
        demo_role: role,
        demo_mode: true
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Demo login error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})