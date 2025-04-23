
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createHash } from "https://deno.land/std@0.168.0/hash/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { password } = await req.json()
    if (!password) {
      throw new Error('Password is required')
    }

    // Generate SHA-1 hash of the password
    const hash = createHash('sha1')
    hash.update(password)
    const sha1Hash = hash.toString().toUpperCase()
    const prefix = sha1Hash.slice(0, 5)
    const suffix = sha1Hash.slice(5)

    // Query the HaveIBeenPwned API
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
    const text = await response.text()
    
    // Check if the password suffix exists in the response
    const matches = text.split('\n')
    const match = matches.find(line => line.startsWith(suffix))
    const breachCount = match ? parseInt(match.split(':')[1]) : 0

    return new Response(
      JSON.stringify({ 
        breachCount,
        isCompromised: breachCount > 0 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
