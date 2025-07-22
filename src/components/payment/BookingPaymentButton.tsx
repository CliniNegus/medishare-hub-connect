import React from 'react';
import { Button } from "@/components/ui/button";
import { useBookingPayment } from "@/hooks/useBookingPayment";
import { usePaymentCancellation } from "@/hooks/usePaymentCancellation";
import PaymentLoadingSpinner from "./PaymentLoadingSpinner";

interface BookingPaymentButtonProps {
  amount: number;
  equipmentId: string;
  equipmentName: string;
  bookingDetails: string;
  notes?: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  street: string;
  city: string;
  country: string;
  zipCode: string;
  onSuccess?: (reference: string) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

const BookingPaymentButton = ({ 
  amount, 
  equipmentId,
  equipmentName,
  bookingDetails,
  notes = "",
  fullName,
  phoneNumber,
  email,
  street,
  city,
  country,
  zipCode,
  onSuccess, 
  onError,
  className,
  children
}: BookingPaymentButtonProps) => {
  const { loading, setLoading, handlePayment } = useBookingPayment({
    amount,
    equipmentId,
    equipmentName,
    bookingDetails,
    notes,
    fullName,
    phoneNumber,
    email,
    street,
    city,
    country,
    zipCode,
    onSuccess,
    onError
  });

  usePaymentCancellation(loading, (error) => {
    setLoading(false);
    onError?.(error);
  });

  const isValidShipping = fullName.trim() && phoneNumber.trim() && email.trim() && 
                         street.trim() && city.trim() && country.trim();

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || !isValidShipping}
      className={`bg-[#E02020] hover:bg-[#c01010] text-white ${className}`}
    >
      {loading ? (
        <PaymentLoadingSpinner />
      ) : children || 'Complete Booking'}
    </Button>
  );
};

export default BookingPaymentButton;