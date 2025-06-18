
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/contexts/CartContext';

interface UseCartPaymentProps {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  shippingAddress: string;
  notes: string;
}

export const useCartPayment = ({ items, totalPrice, totalItems, shippingAddress, notes }: UseCartPaymentProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

  // Handle visibility change to detect when user returns from Paystack
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isProcessingPayment) {
        // Check if there's payment info in URL
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get('reference');
        const status = urlParams.get('status');
        
        if (reference || status) {
          // There's payment info, let verification handle it
          return;
        }
        
        // No payment info, likely cancelled - wait a bit then reset
        setTimeout(() => {
          setIsProcessingPayment(false);
          console.log('Cart payment process reset due to page visibility change - no payment info detected');
        }, 2000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isProcessingPayment]);

  // Handle page focus to detect when user returns
  React.useEffect(() => {
    const handleFocus = () => {
      if (isProcessingPayment) {
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get('reference');
        const status = urlParams.get('status');
        
        if (reference || status) {
          // Payment completed, let the verification process handle it
          return;
        }
        
        // No payment info in URL, likely a cancellation
        setTimeout(() => {
          setIsProcessingPayment(false);
          toast({
            title: "Payment Cancelled",
            description: "Cart payment was not completed. You can try again.",
            variant: "destructive",
          });
          
          // Redirect to payment cancelled page
          setTimeout(() => {
            window.location.href = '/payment-cancelled';
          }, 1500);
        }, 1000);
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isProcessingPayment, toast]);

  // Check for payment result on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    const status = urlParams.get('status');
    
    if (reference && status && isProcessingPayment) {
      // Payment completed, redirect based on status
      if (status === 'success') {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        setTimeout(() => {
          window.location.href = '/payment-success';
        }, 1500);
      } else {
        toast({
          title: "Payment Failed",
          description: "Your payment could not be processed.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/payment-failed';
        }, 1500);
      }
    }
  }, [isProcessingPayment, toast]);

  const handleInitiatePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your purchase",
        variant: "destructive",
      });
      return;
    }

    if (!shippingAddress.trim()) {
      toast({
        title: "Shipping address required",
        description: "Please provide a shipping address",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessingPayment(true);

      const reference = `cb_cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('Initiating cart payment with data:', {
        totalPrice,
        itemCount: items.length,
        reference,
        email: user.email
      });

      const cartItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      }));

      const { error: dbError } = await supabase
        .from('transactions')
        .insert({
          amount: totalPrice,
          user_id: user.id,
          reference,
          currency: 'KES',
          status: 'pending',
          metadata: { 
            email: user.email,
            cart_items: cartItems,
            shipping_address: shippingAddress,
            notes: notes,
            item_count: totalItems,
            order_type: 'cart_checkout'
          }
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to create transaction record');
      }

      const { data, error } = await supabase.functions.invoke('handle-payment', {
        body: { 
          amount: totalPrice,
          email: user.email,
          metadata: {
            reference,
            user_id: user.id,
            cart_items: cartItems,
            shipping_address: shippingAddress,
            notes: notes,
            item_count: totalItems,
            order_type: 'cart_checkout'
          }
        }
      });

      if (error) {
        console.error('Payment initialization error:', error);
        throw new Error(error.message || 'Failed to initialize payment');
      }

      console.log('Payment initialization response:', data);

      if (!data || !data.status) {
        throw new Error('Invalid payment response from Paystack');
      }

      if (!data.data?.authorization_url) {
        throw new Error('No authorization URL received from Paystack');
      }

      sessionStorage.setItem('paystack_payment_reference', reference);
      sessionStorage.setItem('paystack_payment_timestamp', Date.now().toString());

      toast({
        title: "Payment Initiated",
        description: "Redirecting to Paystack for payment...",
      });

      // Set a timeout to detect if user doesn't complete payment
      setTimeout(() => {
        if (isProcessingPayment) {
          console.log('Payment timeout detected, checking if user returned without completing payment');
          // The focus/visibility handlers will handle the actual cancellation detection
        }
      }, 300000); // 5 minutes timeout

      window.location.href = data.data.authorization_url;

    } catch (error: any) {
      console.error('Payment error:', error);
      setIsProcessingPayment(false);
      toast({
        title: "Payment Failed",
        description: error.message || "Could not process payment",
        variant: "destructive",
      });
    }
  };

  return {
    isProcessingPayment,
    handleInitiatePayment
  };
};
