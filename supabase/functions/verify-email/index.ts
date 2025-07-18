
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle GET requests (direct links from email) - redirect to frontend
  if (req.method === "GET") {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    
    if (token) {
      // Redirect to frontend route with token
      const redirectUrl = `https://bqgipoqlxizdpryguzac.lovableproject.com/verify?token=${encodeURIComponent(token)}`;
      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectUrl,
          ...corsHeaders
        }
      });
    } else {
      // No token provided in GET request
      return new Response(null, {
        status: 302,
        headers: {
          'Location': 'https://bqgipoqlxizdpryguzac.lovableproject.com/auth',
          ...corsHeaders
        }
      });
    }
  }

  try {
    // Parse request body to get token (for POST requests from frontend)
    const { token } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Token is required" 
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify the token
    const { data: isValid, error: verifyError } = await supabase.rpc('verify_email_token', {
      token_hash_param: token
    });

    if (verifyError || !isValid) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "The verification link is invalid or has expired." 
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Get user info for welcome email
    const { data: verificationRecord } = await supabase
      .from('email_verification_log')
      .select('email, user_id')
      .eq('token_hash', token)
      .eq('verified_at', null)
      .single();

    if (verificationRecord) {
      // Get user profile for welcome email
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', verificationRecord.user_id)
        .single();

      // Send welcome email
      try {
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            email: verificationRecord.email,
            fullName: profile?.full_name
          }
        });
        console.log('Welcome email sent to:', verificationRecord.email);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't fail verification if welcome email fails
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email verified successfully!" 
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error("Error in verify-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "An error occurred during verification. Please try again." 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);
