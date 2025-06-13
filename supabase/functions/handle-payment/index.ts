
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaymentRequest {
  amount: number;
  email: string;
  metadata: {
    reference: string;
    user_id: string;
    equipment_id?: string;
    equipment_name?: string;
    cart_items?: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      total: number;
    }>;
    shipping_address?: string;
    notes?: string;
    item_count?: number;
    order_type?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    console.log('Authorization header present:', !!authHeader);

    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!PAYSTACK_SECRET_KEY) {
      console.error('PAYSTACK_SECRET_KEY environment variable not found');
      throw new Error('Payment service not configured');
    }

    console.log('Paystack secret key configured');

    const { amount, email, metadata }: PaymentRequest = await req.json();

    console.log('Payment request received:', {
      amount,
      email,
      reference: metadata.reference,
      order_type: metadata.order_type,
      item_count: metadata.item_count
    });

    // Validate required fields
    if (!amount || !email || !metadata.reference) {
      throw new Error('Missing required payment fields');
    }

    // Convert amount to cents (Paystack expects amount in kobo for NGN, cents for other currencies)
    const amountInCents = Math.round(amount * 100);

    // Create callback URL for payment verification
    const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/verify-payment`;

    const paymentData = {
      amount: amountInCents,
      email,
      reference: metadata.reference,
      currency: 'KES', // Kenyan Shillings
      callback_url: callbackUrl,
      metadata: {
        ...metadata,
        custom_fields: [
          {
            display_name: "Order Type",
            variable_name: "order_type",
            value: metadata.order_type || "purchase"
          },
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: metadata.user_id || ""
          }
        ]
      }
    };

    // Add equipment specific fields if present
    if (metadata.equipment_id) {
      paymentData.metadata.custom_fields.push(
        {
          display_name: "Equipment ID",
          variable_name: "equipment_id",
          value: metadata.equipment_id
        },
        {
          display_name: "Equipment Name", 
          variable_name: "equipment_name",
          value: metadata.equipment_name || ""
        }
      );
    }

    // Add cart specific fields if present
    if (metadata.cart_items && metadata.cart_items.length > 0) {
      paymentData.metadata.custom_fields.push({
        display_name: "Items Count",
        variable_name: "items_count",
        value: metadata.item_count?.toString() || metadata.cart_items.length.toString()
      });
    }

    console.log('Sending to Paystack:', {
      amount: amountInCents,
      email,
      reference: metadata.reference,
      currency: 'KES'
    });

    // Initialize payment with Paystack
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const result: PaystackInitializeResponse = await response.json();

    console.log('Paystack response:', {
      status: result.status,
      message: result.message,
      hasAuthUrl: !!result.data?.authorization_url
    });

    if (!result.status) {
      console.error('Paystack initialization failed:', result.message);
      throw new Error(result.message || 'Payment initialization failed');
    }

    // Initialize Supabase client to update transaction
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });

      // Update transaction with Paystack access code
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ 
          paystack_reference: result.data.reference,
          metadata: {
            ...metadata,
            access_code: result.data.access_code,
            authorization_url: result.data.authorization_url
          }
        })
        .eq('reference', metadata.reference);

      if (updateError) {
        console.error('Failed to update transaction:', updateError);
      } else {
        console.log('Transaction updated with Paystack details');
      }
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    return new Response(
      JSON.stringify({ 
        status: false,
        message: error.message,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
