
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  fullName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY is not configured");
    }

    const { email, fullName }: WelcomeEmailRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const firstName = fullName ? fullName.split(' ')[0] : '';
    const greeting = firstName ? `Hello ${firstName}` : 'Hello';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to CliniBuilds!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #E02020; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Welcome to CliniBuilds!</h1>
              <p style="color: #ffffff; margin: 10px 0 0; font-size: 16px;">Medical Equipment Sharing Platform</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #333333; margin: 0 0 20px; font-size: 24px;">${greeting}! 🎉</h2>
              
              <p style="color: #666666; line-height: 1.6; margin: 0 0 20px; font-size: 16px;">
                Welcome to CliniBuilds! We're excited to have you join our community of healthcare professionals revolutionizing medical equipment access.
              </p>
              
              <p style="color: #666666; line-height: 1.6; margin: 0 0 30px; font-size: 16px;">
                Your account is now verified and ready to use. Here's what you can do:
              </p>
              
              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0;">
                <ul style="margin: 0; padding: 0; list-style: none;">
                  <li style="margin-bottom: 15px; padding-left: 25px; position: relative;">
                    <span style="position: absolute; left: 0; color: #E02020; font-weight: bold;">✓</span>
                    Browse and book medical equipment from trusted partners
                  </li>
                  <li style="margin-bottom: 15px; padding-left: 25px; position: relative;">
                    <span style="position: absolute; left: 0; color: #E02020; font-weight: bold;">✓</span>
                    Access financing options for equipment purchases
                  </li>
                  <li style="margin-bottom: 15px; padding-left: 25px; position: relative;">
                    <span style="position: absolute; left: 0; color: #E02020; font-weight: bold;">✓</span>
                    Connect with manufacturers and suppliers
                  </li>
                  <li style="margin-bottom: 0; padding-left: 25px; position: relative;">
                    <span style="position: absolute; left: 0; color: #E02020; font-weight: bold;">✓</span>
                    Track your orders and manage your inventory
                  </li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${Deno.env.get("SUPABASE_URL")?.replace('/functions/v1', '') || 'https://clinibuilds.com'}/dashboard" 
                   style="background-color: #E02020; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
              
              <p style="color: #666666; line-height: 1.6; margin: 20px 0 0; font-size: 14px;">
                Need help getting started? Feel free to reach out to our support team anytime.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
              <p style="color: #999999; font-size: 12px; line-height: 1.4; margin: 0;">
                <strong>CliniBuilds Platform</strong><br>
                Medical Equipment Sharing & Management<br>
                Nairobi, Kenya
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const textContent = `
Welcome to CliniBuilds!

${greeting}! 🎉

Welcome to CliniBuilds! We're excited to have you join our community of healthcare professionals revolutionizing medical equipment access.

Your account is now verified and ready to use. Here's what you can do:

✓ Browse and book medical equipment from trusted partners
✓ Access financing options for equipment purchases  
✓ Connect with manufacturers and suppliers
✓ Track your orders and manage your inventory

Visit your dashboard: ${Deno.env.get("SUPABASE_URL")?.replace('/functions/v1', '') || 'https://clinibuilds.com'}/dashboard

Need help getting started? Feel free to reach out to our support team anytime.

---
CliniBuilds Platform  
Medical Equipment Sharing & Management
Nairobi, Kenya
`;

    const emailPayload = {
      sender: {
        name: "Negus Med Ltd.",
        email: "a.omune@negusmed.com"
      },
      to: [
        {
          email: email
        }
      ],
      subject: "Welcome to CliniBuilds! 🎉",
      htmlContent: htmlContent,
      textContent: textContent,
    };

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

    console.log("Welcome email sent successfully via Brevo:", responseData);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Welcome email sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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
