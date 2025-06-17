
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CartCheckoutFormProps {
  totalItems: number;
  totalPrice: number;
  shippingAddress: string;
  notes: string;
  onShippingAddressChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

const CartCheckoutForm = ({ 
  totalItems, 
  totalPrice, 
  shippingAddress, 
  notes, 
  onShippingAddressChange, 
  onNotesChange 
}: CartCheckoutFormProps) => {
  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h3 className="font-semibold text-lg mb-2">Checkout Details</h3>
        <div className="text-sm text-gray-600">
          {totalItems} item(s) • Ksh {totalPrice.toLocaleString()}
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="shipping-address">Shipping Address *</Label>
          <Textarea
            id="shipping-address"
            placeholder="Enter your full shipping address"
            value={shippingAddress}
            onChange={(e) => onShippingAddressChange(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="notes">Order Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any special instructions or notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="mt-1"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default CartCheckoutForm;
