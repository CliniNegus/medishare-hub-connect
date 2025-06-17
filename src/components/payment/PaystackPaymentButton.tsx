
import React from 'react';
import { Button } from "@/components/ui/button";
import { usePaystackPayment } from "@/hooks/usePaystackPayment";
import { usePaymentCancellation } from "@/hooks/usePaymentCancellation";
import PaymentLoadingSpinner from "./PaymentLoadingSpinner";

interface PaystackPaymentButtonProps {
  amount: number;
  equipmentId: string;
  equipmentName: string;
  onSuccess?: (reference: string) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
  shippingAddress: string;
  notes?: string;
}

const PaystackPaymentButton = ({ 
  amount, 
  equipmentId,
  equipmentName,
  onSuccess, 
  onError,
  className,
  children,
  shippingAddress,
  notes = ""
}: PaystackPaymentButtonProps) => {
  const { loading, setLoading, handlePayment } = usePaystackPayment({
    amount,
    equipmentId,
    equipmentName,
    shippingAddress,
    notes,
    onSuccess,
    onError
  });

  usePaymentCancellation(loading, (error) => {
    setLoading(false);
    onError?.(error);
  });

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || !shippingAddress.trim()}
      className={`bg-[#E02020] hover:bg-[#c01010] text-white ${className}`}
    >
      {loading ? (
        <PaymentLoadingSpinner />
      ) : children || 'Pay with Paystack'}
    </Button>
  );
};

export default PaystackPaymentButton;
