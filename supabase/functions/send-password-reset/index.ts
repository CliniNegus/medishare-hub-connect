
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  resetUrl: string;
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

    const { email, resetUrl, fullName }: PasswordResetRequest = await req.json();

    if (!email || !resetUrl) {
      throw new Error("Email and reset URL are required");
    }

    const firstName = fullName ? fullName.split(' ')[0] : '';
    const greeting = firstName ? `Hello ${firstName}` : 'Hello';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - CliniBuilds</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #E02020; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Reset Your Password</h1>
              <p style="color: #ffffff; margin: 10px 0 0; font-size: 16px;">CliniBuilds - Medical Equipment Platform</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #333333; margin: 0 0 20px; font-size: 24px;">${greeting}!</h2>
              
              <p style="color: #666666; line-height: 1.6; margin: 0 0 20px; font-size: 16px;">
                We received a request to reset your password for your CliniBuilds account.
              </p>
              
              <p style="color: #666666; line-height: 1.6; margin: 0 0 30px; font-size: 16px;">
                Click the button below to create a new password. This link will expire in 1 hour for security reasons.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #E02020; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #666666; line-height: 1.6; margin: 20px 0; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              
              <p style="color: #E02020; word-break: break-all; font-size: 14px; margin: 0 0 20px;">
                ${resetUrl}
              </p>
              
              <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                </p>
              </div>
              
              <p style="color: #666666; line-height: 1.6; margin: 20px 0 0; font-size: 14px; text-align: center;">
                Need help? Contact our support team at 
                <a href="mailto:info@negusmed.com" style="color: #E02020;">info@negusmed.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
              <p style="color: #999999; font-size: 12px; line-height: 1.4; margin: 0; text-align: center;">
                <strong>Negus Med Limited</strong><br>
                CliniBuilds Platform - Medical Equipment Sharing & Management<br>
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
Reset Your Password

${greeting}!

We received a request to reset your password for your CliniBuilds account.

Click this link to create a new password (expires in 1 hour):
${resetUrl}

Security Notice: If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Need help? Contact our support team at info@negusmed.com

---
Negus Med Limited
CliniBuilds Platform - Medical Equipment Sharing & Management
Nairobi, Kenya
`;

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
      subject: "Reset Your Password",
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

    console.log("Password reset email sent successfully via Brevo:", responseData);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Password reset email sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
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
