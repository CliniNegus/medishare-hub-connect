
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { PaymentRequest } from './types.ts';
import { PaystackService, buildPaymentData } from './paystack.ts';
import { DatabaseService } from './database.ts';
import { validatePaymentRequest, logPaymentRequest } from './validation.ts';
import { corsHeaders, handleCorsRequest, createErrorResponse, createSuccessResponse } from './cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsRequest();
  }

  try {
    const authHeader = req.headers.get("authorization");
    console.log('Authorization header present:', !!authHeader);

    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY_2');
    if (!PAYSTACK_SECRET_KEY) {
      console.error('PAYSTACK_SECRET_KEY_2 environment variable not found');
      throw new Error('Payment service not configured');
    }

    console.log('Paystack secret key configured');

    const paymentRequest: PaymentRequest = await req.json();
    
    logPaymentRequest(paymentRequest);
    validatePaymentRequest(paymentRequest);

    // Create callback URL for payment verification
    const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/verify-payment`;

    // Build payment data
    const paymentData = buildPaymentData(paymentRequest, callbackUrl);

    // Initialize payment with Paystack
    const paystackService = new PaystackService(PAYSTACK_SECRET_KEY);
    const result = await paystackService.initializePayment(paymentData);

    // Update transaction in database
    const databaseService = new DatabaseService();
    await databaseService.updateTransaction(
      paymentRequest.metadata.reference, 
      result, 
      paymentRequest.metadata
    );

    return createSuccessResponse(result);
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    return createErrorResponse(error.message);
  }
});
