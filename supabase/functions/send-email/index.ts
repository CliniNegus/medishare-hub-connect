
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
  text?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY is not configured");
    }

    const { to, subject, html, from = "info@negusmed.com", text } = await req.json() as EmailRequest;

    if (!to || !subject || !html) {
      throw new Error("Missing required email parameters");
    }

    // Prepare Brevo email payload
    const emailPayload = {
      sender: {
        name: "Negus Med Limited",
        email: from
      },
      to: [
        {
          email: to
        }
      ],
      subject: subject,
      htmlContent: html,
      ...(text && { textContent: text })
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

    console.log("Email sent successfully via Brevo:", responseData);

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
