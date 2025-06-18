
import React, { useEffect } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const PaymentCancelled = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Clean up URL parameters
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, document.title, url.pathname);
  }, []);

  const handleReturnToCart = () => {
    window.location.href = '/shop';
  };

  const handleReturnHome = () => {
    window.location.href = user ? '/dashboard' : '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl text-yellow-800">Payment Cancelled</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-gray-600">
            <p className="text-lg font-medium mb-2">Payment was cancelled</p>
            <p className="text-sm">You cancelled the payment process. Your items are still in your cart and no charges were made.</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              <strong>Your cart items are safe!</strong>
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              You can continue shopping or try the payment process again when you're ready.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleReturnToCart}
              className="w-full bg-[#E02020] hover:bg-[#c01010] text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Shopping
            </Button>
            
            <Button 
              onClick={handleReturnHome}
              variant="outline"
              className="w-full"
            >
              Go to {user ? 'Dashboard' : 'Home'}
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

export default PaymentCancelled;
