
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PaystackPaymentButtonProps {
  amount: number;
  equipmentId: string;
  equipmentName: string;
  onSuccess?: (reference: string) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
  shippingAddress: string;
  notes?: string;
}

const PaystackPaymentButton = ({ 
  amount, 
  equipmentId,
  equipmentName,
  onSuccess, 
  onError,
  className,
  children,
  shippingAddress,
  notes = ""
}: PaystackPaymentButtonProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);

  // Handle visibility change to detect when user returns from Paystack
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && loading) {
        // User returned to the page while payment was in progress
        // Reset loading state after a short delay to allow for successful redirects
        setTimeout(() => {
          setLoading(false);
          console.log('Payment process reset due to page visibility change');
        }, 2000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loading]);

  // Handle page focus to detect when user returns
  React.useEffect(() => {
    const handleFocus = () => {
      if (loading) {
        // User returned to the page, check if there's a payment result in URL
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get('reference');
        const status = urlParams.get('status');
        
        if (reference || status) {
          // There's payment info in URL, let the verification process handle it
          return;
        }
        
        // No payment info in URL, likely a cancellation
        setTimeout(() => {
          setLoading(false);
          toast({
            title: "Payment Cancelled",
            description: "Payment was not completed. You can try again.",
            variant: "destructive",
          });
          onError?.("Payment was cancelled by user");
        }, 1000);
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [loading, toast, onError]);

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

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || !shippingAddress.trim()}
      className={`bg-[#E02020] hover:bg-[#c01010] text-white ${className}`}
    >
      {loading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing Payment...
        </div>
      ) : children || 'Pay with Paystack'}
    </Button>
  );
};

export default PaystackPaymentButton;
