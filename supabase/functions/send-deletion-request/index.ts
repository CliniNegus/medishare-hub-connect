import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');
const SUPPORT_EMAIL = 'support@negusmed.com';

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

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First, try to find user by email
    const { data: userData } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    // Use found user_id or generate a placeholder UUID for non-existing users
    const userId = userData?.id || '00000000-0000-0000-0000-000000000000';

    // Insert deletion request into support_requests table
    const requestMessage = `
Account Deletion Request

Full Name: ${full_name}
Email: ${email}
Account Type: ${account_type}
${message ? `\nReason: ${message}` : ''}

This request was submitted via the public deletion request form.
Please process within 7 business days as per Google Play's Data Deletion Policy.
    `.trim();

    const { error: insertError } = await supabase
      .from('support_requests')
      .insert({
        user_id: userId,
        subject: `Account Deletion Request - ${full_name}`,
        message: requestMessage,
        priority: 'high',
        status: 'open',
        category: 'account'
      });

    if (insertError) {
      console.error('Error inserting deletion request:', insertError);
      throw new Error(`Failed to submit deletion request: ${insertError.message}`);
    }

    // Send email notification to support
    try {
      const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY!,
        },
        body: JSON.stringify({
          sender: { email: 'noreply@clinibuilds.com', name: 'Clinibuilds' },
          to: [{ email: SUPPORT_EMAIL }],
          subject: `Account Deletion Request - ${full_name}`,
          htmlContent: `
            <h2>Account Deletion Request</h2>
            <p><strong>Full Name:</strong> ${full_name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Account Type:</strong> ${account_type}</p>
            ${message ? `<p><strong>Reason:</strong> ${message}</p>` : ''}
            <p><em>This request was submitted via the public deletion request form.</em></p>
            <p><em>Please process within 7 business days as per Google Play's Data Deletion Policy.</em></p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Failed to send email notification:', await emailResponse.text());
      } else {
        console.log('Email notification sent successfully to:', SUPPORT_EMAIL);
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the request if email fails
    }

    console.log('Deletion request submitted successfully for:', email);

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
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: 'Please try again or contact support@negusmed.com directly'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
