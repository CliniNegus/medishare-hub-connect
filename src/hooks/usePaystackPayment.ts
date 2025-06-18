
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UsePaystackPaymentProps {
  amount: number;
  equipmentId: string;
  equipmentName: string;
  shippingAddress: string;
  notes: string;
  onSuccess?: (reference: string) => void;
  onError?: (error: string) => void;
}

export const usePaystackPayment = ({
  amount,
  equipmentId,
  equipmentName,
  shippingAddress,
  notes,
  onSuccess,
  onError
}: UsePaystackPaymentProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);

  // Check for payment result on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    const status = urlParams.get('status');
    
    if (reference && status && loading) {
      // Payment completed, redirect based on status
      if (status === 'success') {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        onSuccess?.(reference);
        setTimeout(() => {
          window.location.href = '/payment-success';
        }, 1500);
      } else {
        toast({
          title: "Payment Failed",
          description: "Your payment could not be processed.",
          variant: "destructive",
        });
        onError?.("Payment failed");
        setTimeout(() => {
          window.location.href = '/payment-failed';
        }, 1500);
      }
    }
  }, [loading, toast, onSuccess, onError]);

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make a payment",
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

    try {
      setLoading(true);

      // Generate a unique reference
      const reference = `cb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('Initiating payment with data:', {
        amount,
        equipmentId,
        reference,
        email: user.email
      });

      // Create transaction record first
      const { error: dbError } = await supabase
        .from('transactions')
        .insert({
          amount,
          user_id: user.id,
          reference,
          currency: 'KES',
          status: 'pending',
          metadata: { 
            email: user.email,
            equipment_id: equipmentId,
            equipment_name: equipmentName,
            shipping_address: shippingAddress,
            notes: notes
          }
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to create transaction record');
      }

      // Initialize payment with Paystack
      const { data, error } = await supabase.functions.invoke('handle-payment', {
        body: { 
          amount,
          email: user.email,
          metadata: {
            reference,
            user_id: user.id,
            equipment_id: equipmentId,
            equipment_name: equipmentName,
            shipping_address: shippingAddress,
            notes: notes
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

      // Store payment reference in sessionStorage to track it
      sessionStorage.setItem('paystack_payment_reference', reference);
      sessionStorage.setItem('paystack_payment_timestamp', Date.now().toString());

      toast({
        title: "Payment Initiated",
        description: "Redirecting to Paystack for payment...",
      });

      // Set a timeout to detect if user doesn't complete payment
      setTimeout(() => {
        if (loading) {
          console.log('Payment timeout detected for individual payment');
          // The cancellation hook will handle the actual detection
        }
      }, 300000); // 5 minutes timeout

      // Redirect to Paystack checkout
      window.location.href = data.data.authorization_url;

      onSuccess?.(reference);
    } catch (error: any) {
      console.error('Payment error:', error);
      setLoading(false);
      toast({
        title: "Payment Failed",
        description: error.message || "Could not process payment",
        variant: "destructive",
      });
      onError?.(error.message);
    }
  };

  return {
    loading,
    setLoading,
    handlePayment
  };
};
