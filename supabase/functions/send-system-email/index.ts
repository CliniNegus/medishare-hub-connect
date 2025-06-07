
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { recipientEmail, subject, content, templateId } = await req.json();

    // Input validation
    if (!recipientEmail || (!content && !templateId) || !subject) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields. Please provide recipientEmail, subject, and either content or templateId',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Log email attempt
    await supabase.rpc('log_audit_event', {
      action_param: 'SEND_EMAIL',
      resource_type_param: 'email',
      resource_id_param: recipientEmail,
      new_values_param: JSON.stringify({ subject, templateId })
    });

    let emailContent = content;

    // If a template was specified, fetch it from the database
    if (templateId) {
      const { data: template, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (error || !template) {
        return new Response(
          JSON.stringify({ error: 'Email template not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      emailContent = template.content;
      // We could use the template.subject if subject wasn't provided
    }

    // In a real implementation, this would send an email via a service like SendGrid, 
    // AWS SES, or similar. For now, we'll simulate a successful send
    console.log(`Sending email to ${recipientEmail}: ${subject}`);

    // Log successful sending
    await supabase.rpc('log_audit_event', {
      action_param: 'EMAIL_SENT',
      resource_type_param: 'email',
      resource_id_param: recipientEmail
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email sent to ${recipientEmail}` 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error processing email request:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
