import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeletionRequest {
  full_name: string;
  email: string;
  account_type: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { full_name, email, account_type, message }: DeletionRequest = await req.json();

    // Validate required fields
    if (!full_name || !email || !account_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Here you can integrate with Brevo API to send email notification to admin
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    
    if (!brevoApiKey) {
      console.error('BREVO_API_KEY not configured');
      // Still return success to user, but log the error
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Deletion request received (email notification pending configuration)' 
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Send email notification to admin using Brevo
    const emailPayload = {
      sender: { email: "noreply@clinibuilds.com", name: "CliniBuilds" },
      to: [{ email: "support@clinibuilds.com", name: "CliniBuilds Support" }],
      subject: `Account Deletion Request from ${full_name}`,
      htmlContent: `
        <h2>New Account Deletion Request</h2>
        <p>A user has requested account deletion:</p>
        <ul>
          <li><strong>Full Name:</strong> ${full_name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Account Type:</strong> ${account_type}</li>
          <li><strong>Submission Date:</strong> ${new Date().toISOString()}</li>
        </ul>
        ${message ? `<p><strong>Reason:</strong><br>${message}</p>` : ''}
        <hr>
        <p><small>Please process this deletion request within 7 business days as per Google Play's Data Deletion Policy.</small></p>
      `,
    };

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Brevo API error:', errorData);
      throw new Error('Failed to send email notification');
    }

    console.log('Deletion request email sent successfully for:', email);

    // Also send confirmation email to the user
    const userEmailPayload = {
      sender: { email: "noreply@clinibuilds.com", name: "CliniBuilds" },
      to: [{ email: email, name: full_name }],
      subject: "Account Deletion Request Received - CliniBuilds",
      htmlContent: `
        <h2>Account Deletion Request Received</h2>
        <p>Dear ${full_name},</p>
        <p>We have received your request to delete your CliniBuilds account and associated data.</p>
        <p>Our team will verify your information and process the deletion within <strong>7 business days</strong>.</p>
        <p>Once the deletion is complete, you will receive a final confirmation email.</p>
        <hr>
        <p>If you did not make this request or have any questions, please contact us at support@clinibuilds.com immediately.</p>
        <p>Best regards,<br>The CliniBuilds Team</p>
      `,
    };

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify(userEmailPayload),
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Deletion request submitted successfully' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-deletion-request function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
