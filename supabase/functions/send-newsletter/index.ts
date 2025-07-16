import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  subject: string;
  htmlContent: string;
  textContent?: string;
  targetRole?: 'all' | 'hospital' | 'manufacturer' | 'investor' | 'admin';
  recipientEmails?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!brevoApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { subject, htmlContent, textContent, targetRole = 'all', recipientEmails }: NewsletterRequest = await req.json();

    if (!subject || !htmlContent) {
      throw new Error("Subject and HTML content are required");
    }

    let recipients: string[] = [];

    if (recipientEmails && recipientEmails.length > 0) {
      recipients = recipientEmails;
    } else {
      // Get recipients from database based on role
      let query = supabase
        .from('profiles')
        .select('email')
        .not('email', 'is', null);

      if (targetRole !== 'all') {
        query = query.eq('role', targetRole);
      }

      const { data: profiles, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch recipients: ${error.message}`);
      }

      recipients = profiles?.map(p => p.email).filter(Boolean) || [];
    }

    if (recipients.length === 0) {
      throw new Error("No recipients found");
    }

    // Add unsubscribe footer to HTML content
    const unsubscribeUrl = `${supabaseUrl.replace('/functions/v1', '')}/unsubscribe`;
    const htmlWithUnsubscribe = htmlContent + `
      <hr style="margin: 40px 0; border: none; border-top: 1px solid #e0e0e0;">
      <div style="text-align: center; font-size: 12px; color: #999999; padding: 20px;">
        <p>You are receiving this email because you have an account with CliniBuilds.</p>
        <p>
          <a href="${unsubscribeUrl}?email={{contact.EMAIL}}" style="color: #999999;">Unsubscribe</a> | 
          <a href="${supabaseUrl.replace('/functions/v1', '')}/privacy-policy" style="color: #999999;">Privacy Policy</a>
        </p>
        <p><strong>Negus Med Limited</strong><br>CliniBuilds Platform, Nairobi, Kenya</p>
      </div>
    `;

    const textWithUnsubscribe = (textContent || htmlContent.replace(/<[^>]*>/g, '')) + `
    
---
You are receiving this email because you have an account with CliniBuilds.
Unsubscribe: ${unsubscribeUrl}
Privacy Policy: ${supabaseUrl.replace('/functions/v1', '')}/privacy-policy
Negus Med Limited - CliniBuilds Platform, Nairobi, Kenya
    `;

    // Send emails in batches to avoid rate limits
    const BATCH_SIZE = 50;
    const DELAY_MS = 1000; // 1 second between batches
    
    let successCount = 0;
    let failureCount = 0;
    const failures: string[] = [];

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      
      const emailPayload = {
        sender: {
          name: "Negus Med Limited",
          email: "info@negusmed.com"
        },
        to: batch.map(email => ({ email })),
        subject: subject,
        htmlContent: htmlWithUnsubscribe,
        textContent: textWithUnsubscribe,
        headers: {
          'X-Campaign-Type': 'newsletter',
          'List-Unsubscribe': `<${unsubscribeUrl}>`
        }
      };

      try {
        const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
          },
          body: JSON.stringify(emailPayload),
        });

        const responseData = await brevoResponse.json();

        if (brevoResponse.ok) {
          successCount += batch.length;
          console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} sent successfully:`, responseData);
        } else {
          failureCount += batch.length;
          failures.push(...batch);
          console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, responseData);
        }
      } catch (error) {
        failureCount += batch.length;
        failures.push(...batch);
        console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error);
      }

      // Delay between batches to respect rate limits
      if (i + BATCH_SIZE < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    }

    const result = {
      success: true,
      message: `Newsletter sent to ${successCount} recipients`,
      totalRecipients: recipients.length,
      successCount,
      failureCount,
      failures: failures.length > 0 ? failures : undefined
    };

    console.log("Newsletter sending completed:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-newsletter function:", error);
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
