
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CartItem } from '@/contexts/CartContext';

interface CartCheckoutFormProps {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  street: string;
  city: string;
  country: string;
  zipCode: string;
  notes: string;
  onFullNameChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onStreetChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onZipCodeChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

const CartCheckoutForm = ({ 
  items,
  totalItems, 
  totalPrice, 
  fullName,
  phoneNumber,
  email,
  street,
  city,
  country,
  zipCode,
  notes, 
  onFullNameChange,
  onPhoneNumberChange,
  onEmailChange,
  onStreetChange,
  onCityChange,
  onCountryChange,
  onZipCodeChange,
  onNotesChange 
}: CartCheckoutFormProps) => {
  const subtotal = totalPrice;
  const shippingFee = subtotal > 5000 ? 0 : 500; // Free shipping over Ksh 5,000
  const taxes = 0; // No taxes for now
  const totalAmount = subtotal + shippingFee + taxes;
  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="border-b pb-4">
        <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
        
        {/* Product List */}
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-sm font-medium text-gray-900">
                Ksh {(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({totalItems} items)</span>
            <span>Ksh {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? 'Free' : `Ksh ${shippingFee.toLocaleString()}`}</span>
          </div>
          {taxes > 0 && (
            <div className="flex justify-between text-sm">
              <span>Taxes</span>
              <span>Ksh {taxes.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-semibold pt-2 border-t">
            <span>Total</span>
            <span className="text-red-600">Ksh {totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {/* Shipping Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Shipping Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full-name">Full Name *</Label>
            <Input
              id="full-name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              placeholder="e.g. +254 700 000 000"
              value={phoneNumber}
              onChange={(e) => onPhoneNumberChange(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="street">Street Address *</Label>
          <Input
            id="street"
            placeholder="Enter your street address"
            value={street}
            onChange={(e) => onStreetChange(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="zip-code">Zip Code</Label>
            <Input
              id="zip-code"
              placeholder="Enter zip code"
              value={zipCode}
              onChange={(e) => onZipCodeChange(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="country">Country *</Label>
          <Select value={country} onValueChange={onCountryChange}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Kenya">Kenya</SelectItem>
              <SelectItem value="Uganda">Uganda</SelectItem>
              <SelectItem value="Tanzania">Tanzania</SelectItem>
              <SelectItem value="Rwanda">Rwanda</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="notes">Order Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any special instructions or delivery notes"
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
