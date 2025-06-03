
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone: string | null;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
    };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('Payment service not configured');
    }

    // Initialize Supabase client
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

    // Handle GET request (callback from Paystack)
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const reference = url.searchParams.get('reference');
      
      if (!reference) {
        return new Response(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Payment Error - CliniBuilds</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; background-color: #f5f5f5; text-align: center; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { color: #E02020; margin-bottom: 30px; }
              .error { color: #dc3545; }
              .button { display: inline-block; background-color: #E02020; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>CliniBuilds</h1>
              </div>
              <div class="error">
                <h2>Payment Error</h2>
                <p>Missing payment reference. Please try again.</p>
                <a href="${supabaseUrl.replace('/functions/v1/verify-payment', '')}/dashboard" class="button">Back to Dashboard</a>
              </div>
            </div>
          </body>
          </html>
        `, {
          status: 400,
          headers: { "Content-Type": "text/html" },
        });
      }

      // Verify payment with Paystack
      console.log('Verifying payment for reference:', reference);
      
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const result: PaystackVerificationResponse = await response.json();
      console.log('Paystack verification result:', { status: result.status, paymentStatus: result.data?.status });

      if (result.status && result.data.status === 'success') {
        // Update transaction status in database
        const { error: updateError } = await supabase
          .from('transactions')
          .update({ 
            status: 'success',
            paystack_reference: result.data.reference,
            metadata: { 
              ...result.data,
              paystack_response: result,
              verified_at: new Date().toISOString()
            }
          })
          .eq('reference', reference);

        if (updateError) {
          console.error('Failed to update transaction:', updateError);
        }

        // Try to update equipment status if equipment_id is available
        if (result.data.metadata?.equipment_id) {
          const { error: equipmentError } = await supabase
            .from('equipment')
            .update({ status: 'sold' })
            .eq('id', result.data.metadata.equipment_id);

          if (equipmentError) {
            console.error('Failed to update equipment status:', equipmentError);
          } else {
            console.log('Equipment status updated to sold');
          }
        }

        // Create order record
        if (result.data.metadata?.equipment_id && result.data.metadata?.user_id) {
          const orderData = {
            equipment_id: result.data.metadata.equipment_id,
            user_id: result.data.metadata.user_id,
            amount: result.data.amount / 100, // Convert from kobo to naira
            payment_method: 'paystack',
            shipping_address: result.data.metadata.shipping_address || '',
            notes: result.data.metadata.notes || '',
            status: 'paid',
            transaction_reference: reference
          };

          const { error: orderError } = await supabase
            .from('orders')
            .insert(orderData);

          if (orderError) {
            console.error('Failed to create order:', orderError);
          } else {
            console.log('Order created successfully');
          }
        }

        return new Response(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Payment Successful - CliniBuilds</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; background-color: #f5f5f5; text-align: center; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { color: #E02020; margin-bottom: 30px; }
              .success { color: #28a745; }
              .button { display: inline-block; background-color: #E02020; color: white; text-decoration: none; padding: 15px 30px; border-radius: 5px; margin-top: 30px; font-weight: bold; }
              .checkmark { font-size: 64px; color: #28a745; margin-bottom: 20px; }
              .details { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: left; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>CliniBuilds</h1>
              </div>
              <div class="checkmark">✓</div>
              <div class="success">
                <h2>Payment Successful!</h2>
                <p>Your payment has been processed successfully.</p>
                <div class="details">
                  <strong>Payment Details:</strong><br>
                  Reference: ${result.data.reference}<br>
                  Amount: ₦${(result.data.amount / 100).toLocaleString()}<br>
                  Status: ${result.data.status}<br>
                  ${result.data.metadata?.equipment_name ? `Equipment: ${result.data.metadata.equipment_name}<br>` : ''}
                </div>
                <p>You will receive an email confirmation shortly.</p>
                <a href="${supabaseUrl.replace('/functions/v1/verify-payment', '')}/dashboard" class="button">Go to Dashboard</a>
              </div>
            </div>
          </body>
          </html>
        `, {
          status: 200,
          headers: { "Content-Type": "text/html" },
        });
      } else {
        // Payment failed
        const { error: updateError } = await supabase
          .from('transactions')
          .update({ 
            status: 'failed',
            metadata: { 
              paystack_response: result,
              failed_at: new Date().toISOString()
            }
          })
          .eq('reference', reference);

        if (updateError) {
          console.error('Failed to update failed transaction:', updateError);
        }

        return new Response(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Payment Failed - CliniBuilds</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; background-color: #f5f5f5; text-align: center; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { color: #E02020; margin-bottom: 30px; }
              .error { color: #dc3545; }
              .button { display: inline-block; background-color: #E02020; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>CliniBuilds</h1>
              </div>
              <div class="error">
                <h2>Payment Failed</h2>
                <p>Your payment could not be processed. Please try again.</p>
                <p><strong>Reference:</strong> ${reference}</p>
                <a href="${supabaseUrl.replace('/functions/v1/verify-payment', '')}/dashboard" class="button">Back to Dashboard</a>
              </div>
            </div>
          </body>
          </html>
        `, {
          status: 400,
          headers: { "Content-Type": "text/html" },
        });
      }
    }

    // Handle POST request (manual verification)
    const body = await req.json();
    const { reference } = body;

    if (!reference) {
      throw new Error('Missing payment reference');
    }

    // Verify payment status with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const result: PaystackVerificationResponse = await response.json();

    // Update transaction status in database
    if (result.status && result.data.status === 'success') {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'success',
          paystack_reference: result.data.reference,
          metadata: { 
            ...result.data,
            paystack_response: result
          }
        })
        .eq('reference', reference);

      if (error) throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: result.status && result.data.status === 'success',
        data: result.data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
