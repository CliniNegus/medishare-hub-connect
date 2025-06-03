
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const handler = async (req: Request): Promise<Response> => {
  try {
    // Get Supabase configuration
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

    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invalid Verification Link - CliniBuilds</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; color: #E02020; margin-bottom: 30px; }
            .error { color: #dc3545; text-align: center; }
            .button { display: inline-block; background-color: #E02020; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CliniBuilds</h1>
            </div>
            <div class="error">
              <h2>Invalid Verification Link</h2>
              <p>The verification link is invalid or missing required parameters.</p>
              <a href="${supabaseUrl.replace('/functions/v1/verify-email', '')}/auth" class="button">Back to Login</a>
            </div>
          </div>
        </body>
        </html>
      `, {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }

    console.log("Verifying email with token:", token);

    // Verify the token
    const { data: isValid, error: verifyError } = await supabase.rpc('verify_email_token', {
      token_hash_param: token
    });

    if (verifyError) {
      console.error("Error verifying token:", verifyError);
      throw new Error("Failed to verify token");
    }

    if (!isValid) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Verification Failed - CliniBuilds</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; color: #E02020; margin-bottom: 30px; }
            .error { color: #dc3545; text-align: center; }
            .button { display: inline-block; background-color: #E02020; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CliniBuilds</h1>
            </div>
            <div class="error">
              <h2>Verification Link Expired</h2>
              <p>This verification link has expired or has already been used.</p>
              <p>Please request a new verification email.</p>
              <a href="${supabaseUrl.replace('/functions/v1/verify-email', '')}/auth" class="button">Back to Login</a>
            </div>
          </div>
        </body>
        </html>
      `, {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }

    // Success page
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email Verified Successfully - CliniBuilds</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
          .header { color: #E02020; margin-bottom: 30px; }
          .success { color: #28a745; }
          .button { display: inline-block; background-color: #E02020; color: white; text-decoration: none; padding: 15px 30px; border-radius: 5px; margin-top: 30px; font-weight: bold; }
          .checkmark { font-size: 64px; color: #28a745; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CliniBuilds</h1>
          </div>
          <div class="checkmark">✓</div>
          <div class="success">
            <h2>Email Verified Successfully!</h2>
            <p>Your email address has been verified. You can now access all features of the CliniBuilds platform.</p>
            <a href="${supabaseUrl.replace('/functions/v1/verify-email', '')}/dashboard" class="button">Go to Dashboard</a>
            <br><br>
            <a href="${supabaseUrl.replace('/functions/v1/verify-email', '')}/auth" style="color: #666; text-decoration: none;">Or sign in here</a>
          </div>
        </div>
      </body>
      </html>
    `, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });

  } catch (error: any) {
    console.error("Error in verify-email function:", error);
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Verification Error - CliniBuilds</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; color: #E02020; margin-bottom: 30px; }
          .error { color: #dc3545; text-align: center; }
          .button { display: inline-block; background-color: #E02020; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CliniBuilds</h1>
          </div>
          <div class="error">
            <h2>Verification Error</h2>
            <p>An error occurred while verifying your email. Please try again or contact support.</p>
            <a href="${supabaseUrl.replace('/functions/v1/verify-email', '')}/auth" class="button">Back to Login</a>
          </div>
        </div>
      </body>
      </html>
    `, {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
};

serve(handler);
