
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  fullName?: string;
  ipAddress?: string;
  userAgent?: string;
}

// Generate a secure random token using Web Crypto API
function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({ success: false, error: "Missing authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Brevo API key
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      console.error("BREVO_API_KEY environment variable is not set");
      return new Response(
        JSON.stringify({ success: false, error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase client with service role key
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

    const { email, fullName, ipAddress, userAgent }: VerificationEmailRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    console.log("Sending verification email to:", email);

    // Generate verification token using Web Crypto API
    const verificationToken = generateSecureToken();
    const tokenHash = btoa(verificationToken); // Base64 encode for URL safety

    // Create verification entry in database using the create_email_verification function
    const { data: verificationId, error: verificationError } = await supabase.rpc('create_email_verification', {
      user_email: email,
      token_hash_param: tokenHash,
      ip_address_param: ipAddress || null,
      user_agent_param: userAgent || null
    });

    if (verificationError) {
      console.error("Failed to create verification entry:", verificationError);
      throw new Error(`Failed to create verification entry: ${verificationError.message}`);
    }

    // Create verification URL pointing to frontend route
    const verificationUrl = `https://bqgipoqlxizdpryguzac.lovableproject.com/verify?token=${encodeURIComponent(tokenHash)}`;
    
    // Create professional email content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - CliniBuilds</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #E02020; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">CliniBuilds</h1>
              <p style="color: #ffffff; margin: 10px 0 0; font-size: 16px;">Medical Equipment Sharing Platform</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #333333; margin: 0 0 20px; font-size: 24px;">Please Verify Your Email</h2>
              
              <p style="color: #666666; line-height: 1.6; margin: 0 0 20px; font-size: 16px;">
                ${fullName ? `Hello ${fullName},` : 'Hello,'}
              </p>
              
              <p style="color: #666666; line-height: 1.6; margin: 0 0 20px; font-size: 16px;">
                Thank you for creating your CliniBuilds account! To get started, please verify your email address by clicking the button below.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #E02020; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #666666; line-height: 1.6; margin: 20px 0; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              
              <p style="color: #E02020; word-break: break-all; font-size: 14px; margin: 0 0 20px;">
                ${verificationUrl}
              </p>
              
              <p style="color: #666666; line-height: 1.6; margin: 20px 0 0; font-size: 14px;">
                This verification link will expire in 24 hours for security reasons.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
              <p style="color: #999999; font-size: 12px; line-height: 1.4; margin: 0;">
                <strong>Negus Med Limited</strong><br>
                CliniBuilds Platform - Medical Equipment Sharing & Management<br>
                Nairobi, Kenya
              </p>
              
              <p style="color: #999999; font-size: 12px; line-height: 1.4; margin: 15px 0 0;">
                If you didn't create an account with CliniBuilds, please ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Plain text version
    const textContent = `
CliniBuilds - Please Verify Your Email

${fullName ? `Hello ${fullName},` : 'Hello,'}

Thank you for creating your CliniBuilds account! To get started, please verify your email address by visiting this link:

${verificationUrl}

This verification link will expire in 24 hours for security reasons.

If you didn't create an account with CliniBuilds, please ignore this email.

---
Negus Med Limited
CliniBuilds Platform - Medical Equipment Sharing & Management
Nairobi, Kenya
`;

    // Prepare Brevo email payload
    const emailPayload = {
      sender: {
        name: "Negus Med Limited",
        email: "info@negusmed.com"
      },
      to: [
        {
          email: email
        }
      ],
      subject: "Please Verify Your Email for CliniBuilds",
      htmlContent: htmlContent,
      textContent: textContent,
      headers: {
        'X-Entity-Ref-ID': verificationId,
        'X-Campaign-Type': 'transactional',
        'X-Category': 'email_verification',
        'List-Unsubscribe': `<${supabaseUrl.replace('/functions/v1', '')}/unsubscribe?email=${encodeURIComponent(email)}>`,
      },
    };

    // Send email using Brevo API
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify(emailPayload),
    });

    const responseData = await brevoResponse.json();

    if (!brevoResponse.ok) {
      console.error("Brevo API error:", responseData);
      throw new Error(`Brevo API error: ${responseData.message || 'Unknown error'}`);
    }

    console.log("Verification email sent successfully via Brevo:", responseData);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Verification email sent successfully",
      verificationId 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
