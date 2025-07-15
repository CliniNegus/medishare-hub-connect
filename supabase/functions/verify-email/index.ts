
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

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head><title>Invalid Verification Link</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>Invalid Verification Link</h1>
          <p>The verification link is invalid or has expired.</p>
        </body>
        </html>`,
        { status: 400, headers: { "Content-Type": "text/html", ...corsHeaders } }
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
        `<!DOCTYPE html>
        <html>
        <head><title>Verification Failed</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>Verification Failed</h1>
          <p>The verification link is invalid or has expired.</p>
          <a href="${supabaseUrl.replace('/functions/v1', '')}/auth" style="color: #E02020;">Back to Sign In</a>
        </body>
        </html>`,
        { status: 400, headers: { "Content-Type": "text/html", ...corsHeaders } }
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

    // Return success page
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Email Verified Successfully</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }
          .container { background: white; padding: 40px; border-radius: 8px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .success { color: #28a745; }
          .btn { background-color: #E02020; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="success">✅ Email Verified Successfully!</h1>
          <p>Your email has been verified. You can now access all features of CliniBuilds.</p>
          <p>A welcome email has been sent to your inbox with helpful next steps.</p>
          <a href="${supabaseUrl.replace('/functions/v1', '')}/dashboard" class="btn">Go to Dashboard</a>
        </div>
      </body>
      </html>`,
      { status: 200, headers: { "Content-Type": "text/html", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in verify-email function:", error);
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head><title>Verification Error</title></head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1>Verification Error</h1>
        <p>An error occurred during verification. Please try again.</p>
      </body>
      </html>`,
      { status: 500, headers: { "Content-Type": "text/html", ...corsHeaders } }
    );
  }
};

serve(handler);
