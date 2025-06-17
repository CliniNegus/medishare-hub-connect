
import { PaymentRequest } from './types.ts';

export function validatePaymentRequest(request: PaymentRequest): void {
  if (!request.amount || !request.email || !request.metadata.reference) {
    throw new Error('Missing required payment fields');
  }
}

export function logPaymentRequest(request: PaymentRequest): void {
  console.log('Payment request received:', {
    amount: request.amount,
    email: request.email,
    reference: request.metadata.reference,
    order_type: request.metadata.order_type,
    item_count: request.metadata.item_count
  });
}
