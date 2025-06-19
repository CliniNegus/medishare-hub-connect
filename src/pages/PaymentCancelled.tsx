
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your payment was cancelled or not completed. Don't worry, no charges were made to your account.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate(-1)}
              className="w-full bg-[#E02020] hover:bg-[#c01010] text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Payment Again
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/shop')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
          
          <div className="text-sm text-gray-500 mt-4">
            <p>Need help? Contact our support team</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelled;
