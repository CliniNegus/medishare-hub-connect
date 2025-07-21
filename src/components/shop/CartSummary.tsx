
import React from 'react';
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  totalPrice: number;
  showCheckoutForm: boolean;
  isProcessingPayment: boolean;
  isShippingFormComplete: boolean;
  onCheckout: () => void;
  onInitiatePayment: () => void;
  onBackToCart: () => void;
  onClearCart: () => void;
}

const CartSummary = ({ 
  totalPrice, 
  showCheckoutForm, 
  isProcessingPayment, 
  isShippingFormComplete, 
  onCheckout, 
  onInitiatePayment, 
  onBackToCart, 
  onClearCart 
}: CartSummaryProps) => {
  return (
    <div className="p-4 border-t bg-gray-50">
      <div className="flex justify-between mb-4">
        <span className="font-medium">Total</span>
        <span className="font-bold text-lg">Ksh {totalPrice.toLocaleString()}</span>
      </div>
      
      {!showCheckoutForm ? (
        <div className="space-y-2">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={onCheckout}
          >
            Proceed to Checkout
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            onClick={onClearCart}
          >
            Clear Cart
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={onInitiatePayment}
            disabled={isProcessingPayment || !isShippingFormComplete}
          >
            {isProcessingPayment ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </div>
            ) : (
              'Proceed to Checkout'
            )}
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            onClick={onBackToCart}
          >
            Back to Cart
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
