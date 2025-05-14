
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createHash } from "https://deno.land/std@0.202.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function checkPasswordBreached(password: string): Promise<{ isCompromised: boolean, breachCount: number }> {
  try {
    // Hash the password with SHA-1
    const hashedPassword = createHash("sha1").update(password).toString().toUpperCase();
    const prefix = hashedPassword.substring(0, 5);
    const suffix = hashedPassword.substring(5);

    // Call the HaveIBeenPwned API
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    
    if (!response.ok) {
      throw new Error(`Error checking password: ${response.statusText}`);
    }
    
    const data = await response.text();
    const lines = data.split('\n');
    
    // Check if the suffix is in the response
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix.trim() === suffix) {
        return { isCompromised: true, breachCount: parseInt(count, 10) };
      }
    }
    
    return { isCompromised: false, breachCount: 0 };
  } catch (error) {
    console.error("Error checking password breach:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const { password } = await req.json();
    
    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Ensure password meets minimum requirements
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (password.length < minLength) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters long' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      return new Response(
        JSON.stringify({ 
          error: 'Password must contain uppercase, lowercase, number, and special characters' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Check if password has been breached
    const breachResult = await checkPasswordBreached(password);

    return new Response(
      JSON.stringify(breachResult),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error) {
    console.error("Error in validate-password function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
});
