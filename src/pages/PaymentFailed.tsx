
import React, { useEffect } from 'react';
import { XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const PaymentFailed = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Clean up URL parameters
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, document.title, url.pathname);
  }, []);

  const handleTryAgain = () => {
    window.location.href = '/shop';
  };

  const handleContactSupport = () => {
    // You can replace this with your actual support contact method
    window.location.href = 'mailto:support@clinibuilds.com';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-800">Payment Failed</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-gray-600">
            <p className="text-lg font-medium mb-2">Payment could not be processed</p>
            <p className="text-sm">Your payment was not completed. This could be due to insufficient funds, network issues, or other payment-related problems.</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              <strong>What you can do:</strong>
            </p>
            <ul className="text-xs text-red-600 mt-2 space-y-1 text-left">
              <li>• Check your card details and try again</li>
              <li>• Ensure you have sufficient funds</li>
              <li>• Try a different payment method</li>
              <li>• Contact your bank if the issue persists</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleTryAgain}
              className="w-full bg-[#E02020] hover:bg-[#c01010] text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={handleContactSupport}
              variant="outline"
              className="w-full"
            >
              Contact Support
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

export default PaymentFailed;
