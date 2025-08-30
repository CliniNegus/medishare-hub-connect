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

    // Create a temporary auth session for the demo account
    const { data: sessionData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email: demoAccount.email,
      password: demoAccount.password,
    })

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