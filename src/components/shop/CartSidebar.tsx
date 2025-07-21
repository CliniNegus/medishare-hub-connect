
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCartPayment } from '@/hooks/useCartPayment';
import CartItems from './CartItems';
import CartCheckoutForm from './CartCheckoutForm';
import CartSummary from './CartSummary';
import EmptyCartState from './EmptyCartState';

const CartSidebar = () => {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  // Shipping form state
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [notes, setNotes] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  
  const { isProcessingPayment, handleInitiatePayment } = useCartPayment({
    items,
    totalPrice,
    totalItems,
    fullName,
    phoneNumber,
    email,
    street,
    city,
    country,
    zipCode,
    notes
  });

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your purchase",
        variant: "destructive",
      });
      return;
    }
    setShowCheckoutForm(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">Your Cart ({totalItems})</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            setIsOpen(false);
            setShowCheckoutForm(false);
          }}
          className="rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <EmptyCartState />
        ) : (
          <div className="space-y-4">
            {!showCheckoutForm ? (
              <CartItems 
                items={items}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            ) : (
              <CartCheckoutForm
                items={items}
                totalItems={totalItems}
                totalPrice={totalPrice}
                fullName={fullName}
                phoneNumber={phoneNumber}
                email={email}
                street={street}
                city={city}
                country={country}
                zipCode={zipCode}
                notes={notes}
                onFullNameChange={setFullName}
                onPhoneNumberChange={setPhoneNumber}
                onEmailChange={setEmail}
                onStreetChange={setStreet}
                onCityChange={setCity}
                onCountryChange={setCountry}
                onZipCodeChange={setZipCode}
                onNotesChange={setNotes}
              />
            )}
          </div>
        )}
      </div>
      
      {items.length > 0 && (
        <CartSummary
          totalPrice={totalPrice}
          showCheckoutForm={showCheckoutForm}
          isProcessingPayment={isProcessingPayment}
          isShippingFormComplete={!!(fullName && phoneNumber && email && street && city && country)}
          onCheckout={handleCheckout}
          onInitiatePayment={handleInitiatePayment}
          onBackToCart={() => setShowCheckoutForm(false)}
          onClearCart={clearCart}
        />
      )}
    </div>
  );
};

export default CartSidebar;
