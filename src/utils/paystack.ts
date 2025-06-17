
// Paystack configuration utilities
export const getPaystackConfig = () => {
  // The public key is available for client-side operations like validation
  // but actual payment processing still uses the secure server-side flow
  return {
    // Public key would be used here for client-side operations if needed
    // Currently using server-side redirect flow which is more secure
    currency: 'KES',
    channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
  };
};

export const validatePaymentAmount = (amount: number): boolean => {
  // Validate minimum amount (100 kobo = 1 KES)
  return amount >= 1;
};

export const formatPaymentReference = (prefix: string = 'cb'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
