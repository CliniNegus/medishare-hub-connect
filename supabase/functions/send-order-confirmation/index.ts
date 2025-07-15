
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  email: string;
  fullName?: string;
  orderId: string;
  orderDetails: {
    equipmentName: string;
    quantity: number;
    amount: number;
    shippingAddress?: string;
    estimatedDelivery?: string;
  };
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

    const { email, fullName, orderId, orderDetails }: OrderConfirmationRequest = await req.json();

    if (!email || !orderId || !orderDetails) {
      throw new Error("Email, order ID, and order details are required");
    }

    const firstName = fullName ? fullName.split(' ')[0] : '';
    const greeting = firstName ? `Hello ${firstName}` : 'Hello';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order is Confirmed - CliniBuilds</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #E02020; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Order Confirmed! ✅</h1>
              <p style="color: #ffffff; margin: 10px 0 0; font-size: 16px;">CliniBuilds - Medical Equipment Platform</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #333333; margin: 0 0 20px; font-size: 24px;">${greeting}!</h2>
              
              <p style="color: #666666; line-height: 1.6; margin: 0 0 20px; font-size: 16px;">
                Thank you for your order! We've received your request and are processing it now.
              </p>
              
              <!-- Order Summary -->
              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #E02020;">
                <h3 style="color: #333333; margin: 0 0 15px; font-size: 18px;">Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-weight: bold;">Order ID:</td>
                    <td style="padding: 8px 0; color: #333333;">#${orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-weight: bold;">Equipment:</td>
                    <td style="padding: 8px 0; color: #333333;">${orderDetails.equipmentName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-weight: bold;">Quantity:</td>
                    <td style="padding: 8px 0; color: #333333;">${orderDetails.quantity}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-weight: bold;">Total Amount:</td>
                    <td style="padding: 8px 0; color: #E02020; font-weight: bold; font-size: 18px;">KES ${orderDetails.amount.toLocaleString()}</td>
                  </tr>
                  ${orderDetails.shippingAddress ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-weight: bold;">Shipping to:</td>
                    <td style="padding: 8px 0; color: #333333;">${orderDetails.shippingAddress}</td>
                  </tr>
                  ` : ''}
                  ${orderDetails.estimatedDelivery ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-weight: bold;">Estimated Delivery:</td>
                    <td style="padding: 8px 0; color: #333333;">${orderDetails.estimatedDelivery}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #2d7a2d; margin: 0 0 10px; font-size: 16px;">What happens next?</h4>
                <ul style="margin: 0; padding-left: 20px; color: #4a4a4a;">
                  <li style="margin-bottom: 8px;">We'll process your order within 1-2 business days</li>
                  <li style="margin-bottom: 8px;">You'll receive shipping confirmation once dispatched</li>
                  <li style="margin-bottom: 8px;">Track your order status in your dashboard</li>
                  <li>Contact support if you have any questions</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${Deno.env.get("SUPABASE_URL")?.replace('/functions/v1', '') || 'https://clinibuilds.com'}/orders" 
                   style="background-color: #E02020; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block; margin-right: 10px;">
                  Track Order
                </a>
                <a href="${Deno.env.get("SUPABASE_URL")?.replace('/functions/v1', '') || 'https://clinibuilds.com'}/dashboard" 
                   style="background-color: #ffffff; color: #E02020; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block; border: 2px solid #E02020;">
                  Dashboard
                </a>
              </div>
              
              <p style="color: #666666; line-height: 1.6; margin: 20px 0 0; font-size: 14px; text-align: center;">
                Questions about your order? Contact our support team at 
                <a href="mailto:info@negusmed.com" style="color: #E02020;">info@negusmed.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
              <p style="color: #999999; font-size: 12px; line-height: 1.4; margin: 0; text-align: center;">
                <strong>NEGUS MED LIMITED</strong><br>
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
Order Confirmed! ✅

${greeting}!

Thank you for your order! We've received your request and are processing it now.

ORDER SUMMARY
=============
Order ID: #${orderId}
Equipment: ${orderDetails.equipmentName}
Quantity: ${orderDetails.quantity}
Total Amount: KES ${orderDetails.amount.toLocaleString()}
${orderDetails.shippingAddress ? `Shipping to: ${orderDetails.shippingAddress}` : ''}
${orderDetails.estimatedDelivery ? `Estimated Delivery: ${orderDetails.estimatedDelivery}` : ''}

WHAT HAPPENS NEXT?
==================
• We'll process your order within 1-2 business days
• You'll receive shipping confirmation once dispatched
• Track your order status in your dashboard
• Contact support if you have any questions

Track your order: ${Deno.env.get("SUPABASE_URL")?.replace('/functions/v1', '') || 'https://clinibuilds.com'}/orders

Questions? Contact support at info@negusmed.com

---
NEGUS MED LIMITED
CliniBuilds Platform - Medical Equipment Sharing & Management
Nairobi, Kenya
`;

    const emailPayload = {
      sender: {
        name: "NEGUS MED LIMITED",
        email: "info@negusmed.com"
      },
      to: [
        {
          email: email
        }
      ],
      subject: "Your Order is Confirmed ✅",
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

    console.log("Order confirmation email sent successfully via Brevo:", responseData);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Order confirmation email sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
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
