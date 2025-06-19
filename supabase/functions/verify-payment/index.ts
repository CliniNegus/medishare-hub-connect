
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

        // Handle different order types
        const orderType = result.data.metadata?.order_type;
        
        if (orderType === 'cart_checkout') {
          // Handle cart checkout orders
          const cartItems = result.data.metadata?.cart_items || [];
          const userId = result.data.metadata?.user_id;
          
          if (userId && cartItems.length > 0) {
            // Create order record for cart checkout
            const orderData = {
              user_id: userId,
              amount: result.data.amount / 100, // Convert from kobo to naira
              payment_method: 'paystack',
              shipping_address: result.data.metadata.shipping_address || '',
              notes: result.data.metadata.notes || '',
              status: 'paid',
              transaction_reference: reference,
              order_type: 'cart_checkout',
              item_count: result.data.metadata.item_count || cartItems.length,
              cart_items: cartItems,
              metadata: {
                paystack_reference: result.data.reference,
                payment_channel: result.data.channel,
                customer_email: result.data.customer.email
              }
            };

            const { error: orderError } = await supabase
              .from('orders')
              .insert(orderData);

            if (orderError) {
              console.error('Failed to create cart order:', orderError);
            } else {
              console.log('Cart order created successfully');
            }

            // Update product stock quantities
            for (const item of cartItems) {
              const { error: stockError } = await supabase
                .from('products')
                .update({ 
                  stock_quantity: supabase.rpc('greatest', [0, supabase.raw(`stock_quantity - ${item.quantity}`)])
                })
                .eq('id', item.id);

              if (stockError) {
                console.error(`Failed to update stock for product ${item.id}:`, stockError);
              }
            }
          }
        } else if (orderType === 'booking') {
          // Handle equipment booking
          if (result.data.metadata?.equipment_id && result.data.metadata?.user_id) {
            const bookingData = {
              equipment_id: result.data.metadata.equipment_id,
              user_id: result.data.metadata.user_id,
              start_time: new Date().toISOString(), // This should be parsed from booking_details
              end_time: new Date(Date.now() + 3600000).toISOString(), // This should be calculated based on duration
              price_paid: result.data.amount / 100,
              notes: result.data.metadata.notes || '',
              status: 'confirmed'
            };

            const { error: bookingError } = await supabase
              .from('bookings')
              .insert(bookingData);

            if (bookingError) {
              console.error('Failed to create booking:', bookingError);
            } else {
              console.log('Booking created successfully');
              
              // Update equipment status to in-use
              const { error: equipmentError } = await supabase
                .from('equipment')
                .update({ status: 'in-use' })
                .eq('id', result.data.metadata.equipment_id);

              if (equipmentError) {
                console.error('Failed to update equipment status:', equipmentError);
              }
            }
          }
        } else {
          // Handle single equipment purchase
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

          // Create order record for single equipment
          if (result.data.metadata?.equipment_id && result.data.metadata?.user_id) {
            const orderData = {
              equipment_id: result.data.metadata.equipment_id,
              user_id: result.data.metadata.user_id,
              amount: result.data.amount / 100, // Convert from kobo to naira
              payment_method: 'paystack',
              shipping_address: result.data.metadata.shipping_address || '',
              notes: result.data.metadata.notes || '',
              status: 'paid',
              transaction_reference: reference,
              order_type: 'single_equipment',
              item_count: 1,
              metadata: {
                equipment_name: result.data.metadata.equipment_name,
                paystack_reference: result.data.reference,
                payment_channel: result.data.channel,
                customer_email: result.data.customer.email
              }
            };

            const { error: orderError } = await supabase
              .from('orders')
              .insert(orderData);

            if (orderError) {
              console.error('Failed to create equipment order:', orderError);
            } else {
              console.log('Equipment order created successfully');
            }
          }
        }

        // Redirect to success page with order details
        const successUrl = `${supabaseUrl.replace('/functions/v1/verify-payment', '')}/payment-success?reference=${reference}&amount=${result.data.amount}&type=${orderType || 'equipment'}`;
        
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
              .redirect-notice { color: #666; font-size: 14px; margin-top: 20px; }
            </style>
            <script>
              setTimeout(() => {
                window.location.href = '${successUrl}';
              }, 3000);
            </script>
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
                  Amount: KES ${(result.data.amount / 100).toLocaleString()}<br>
                  Status: ${result.data.status}<br>
                  ${result.data.metadata?.equipment_name ? `Equipment: ${result.data.metadata.equipment_name}<br>` : ''}
                  ${orderType === 'cart_checkout' ? `Items: ${result.data.metadata?.item_count || 0}<br>` : ''}
                  ${orderType === 'booking' ? `Booking: ${result.data.metadata?.booking_details || 'Equipment booking'}<br>` : ''}
                </div>
                <p>You will receive an email confirmation shortly.</p>
                <div class="redirect-notice">
                  You will be redirected to your order confirmation page in 3 seconds...
                </div>
                <a href="${successUrl}" class="button">View Order Details</a>
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
                <a href="${supabaseUrl.replace('/functions/v1/verify-payment', '')}/payment-cancelled" class="button">Try Again</a>
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
