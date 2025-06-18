
import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const PaymentSuccess = () => {
  const { user } = useAuth();
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on successful payment
    clearCart();
    
    // Clean up URL parameters
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, document.title, url.pathname);
  }, [clearCart]);

  const handleContinueShopping = () => {
    window.location.href = '/shop';
  };

  const handleViewOrders = () => {
    window.location.href = '/orders';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-gray-600">
            <p className="text-lg font-medium mb-2">Thank you for your purchase!</p>
            <p className="text-sm">Your payment has been processed successfully. You will receive an email confirmation shortly.</p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleViewOrders}
              className="w-full bg-[#E02020] hover:bg-[#c01010] text-white"
            >
              View My Orders
            </Button>
            
            <Button 
              onClick={handleContinueShopping}
              variant="outline"
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
          
          {user && (
            <div className="text-xs text-gray-500 pt-4 border-t">
              Logged in as: {user.email}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
