
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, CreditCard, Calendar, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

interface OrderDetails {
  reference: string;
  amount: number;
  orderType: string;
  items?: any[];
  equipmentName?: string;
  createdAt?: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reference = searchParams.get('reference');
    const amount = searchParams.get('amount');
    const type = searchParams.get('type');

    if (!reference || !amount) {
      toast({
        title: "Invalid Payment Reference",
        description: "Could not find payment details. Redirecting to shop.",
        variant: "destructive",
      });
      navigate('/shop');
      return;
    }

    // Set basic order details from URL params
    setOrderDetails({
      reference,
      amount: parseInt(amount) / 100, // Convert from kobo to naira
      orderType: type || 'equipment'
    });

    // Fetch detailed order information
    const fetchOrderDetails = async () => {
      if (!user) return;

      try {
        // First try to get the transaction to get metadata
        const { data: transaction, error: transactionError } = await supabase
          .from('transactions')
          .select('*')
          .eq('reference', reference)
          .eq('user_id', user.id)
          .single();

        if (transactionError) {
          console.error('Error fetching transaction details:', transactionError);
        }

        // Try to get order details
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (orderError) {
          console.error('Error fetching order details:', orderError);
        }

        // Update order details with available information
        setOrderDetails(prev => ({
          ...prev!,
          items: transaction?.metadata?.cart_items || [],
          equipmentName: transaction?.metadata?.equipment_name || order?.equipment_id,
          createdAt: order?.created_at || transaction?.created_at
        }));

      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();

    // Clear cart if it was a cart checkout
    if (type === 'cart_checkout') {
      clearCart();
    }

    // Show success toast
    toast({
      title: "Payment Successful!",
      description: "Your order has been confirmed and will be processed shortly.",
    });
  }, [searchParams, navigate, toast, user, clearCart]);

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E02020]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900 mb-2">Payment Successful!</CardTitle>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-[#E02020]" />
              Order Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Reference ID:</span>
                <span className="font-mono text-sm">{orderDetails.reference}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Order Type:</span>
                <span className="capitalize">
                  {orderDetails.orderType === 'cart_checkout' ? 'Cart Checkout' : 'Equipment Purchase'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-lg">₦{orderDetails.amount.toLocaleString()}</span>
              </div>
              
              {orderDetails.createdAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(orderDetails.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Items Details */}
          {orderDetails.items && orderDetails.items.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Items Ordered</h3>
              <div className="space-y-3">
                {orderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">₦{item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipment Name for single purchase */}
          {orderDetails.equipmentName && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Equipment Purchased</h3>
              <p className="text-gray-700">{orderDetails.equipmentName}</p>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-[#E02020]" />
              Payment Method
            </h3>
            <p className="text-gray-700">Paystack (Card/Bank Transfer)</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              onClick={handleViewOrders}
              className="flex-1 bg-[#E02020] hover:bg-[#c01010] text-white"
            >
              <Package className="w-4 h-4 mr-2" />
              View My Orders
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleContinueShopping}
              className="flex-1"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            <p>You will receive an email confirmation shortly with your order details.</p>
            <p className="mt-1">Need help? Contact our support team.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
