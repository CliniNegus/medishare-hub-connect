
import { PaymentRequest, PaystackInitializeResponse } from './types.ts';

export class PaystackService {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async initializePayment(paymentData: any): Promise<PaystackInitializeResponse> {
    console.log('Sending to Paystack:', {
      amount: paymentData.amount,
      email: paymentData.email,
      reference: paymentData.reference,
      currency: paymentData.currency
    });

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
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

    return result;
  }
}

export function buildPaymentData(request: PaymentRequest, callbackUrl: string) {
  // Convert amount to cents (Paystack expects amount in kobo for NGN, cents for other currencies)
  const amountInCents = Math.round(request.amount * 100);

  const paymentData = {
    amount: amountInCents,
    email: request.email,
    reference: request.metadata.reference,
    currency: 'KES', // Kenyan Shillings
    callback_url: callbackUrl,
    metadata: {
      ...request.metadata,
      custom_fields: [
        {
          display_name: "Order Type",
          variable_name: "order_type",
          value: request.metadata.order_type || "single_equipment"
        },
        {
          display_name: "User ID",
          variable_name: "user_id",
          value: request.metadata.user_id || ""
        }
      ]
    }
  };

  // Add equipment specific fields if present
  if (request.metadata.equipment_id) {
    paymentData.metadata.custom_fields.push(
      {
        display_name: "Equipment ID",
        variable_name: "equipment_id",
        value: request.metadata.equipment_id
      },
      {
        display_name: "Equipment Name", 
        variable_name: "equipment_name",
        value: request.metadata.equipment_name || ""
      }
    );
  }

  // Add cart specific fields if present
  if (request.metadata.cart_items && request.metadata.cart_items.length > 0) {
    paymentData.metadata.custom_fields.push({
      display_name: "Items Count",
      variable_name: "items_count",
      value: request.metadata.item_count?.toString() || request.metadata.cart_items.length.toString()
    });
  }

  return paymentData;
}
