
import React from 'react';

interface BookingPriceSummaryProps {
  pricePerUse: number;
  duration: number;
  totalPrice: number;
}

const BookingPriceSummary: React.FC<BookingPriceSummaryProps> = ({
  pricePerUse,
  duration,
  totalPrice
}) => {
  return (
    <div className="pt-2">
      <div className="flex justify-between text-sm mb-1">
        <span>Price per hour:</span>
        <span>${pricePerUse.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm mb-1">
        <span>Duration:</span>
        <span>{duration} hour{duration > 1 ? 's' : ''}</span>
      </div>
      <div className="flex justify-between font-medium text-base mt-2 pt-2 border-t">
        <span>Total:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default BookingPriceSummary;
