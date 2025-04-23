
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PaystackPaymentButtonProps {
  amount: number;
  onSuccess?: (reference: string) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

const PaystackPaymentButton = ({ 
  amount, 
  onSuccess, 
  onError,
  className,
  children
}: PaystackPaymentButtonProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make a payment",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Generate a unique reference
      const reference = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create transaction record
      const { error: dbError } = await supabase
        .from('transactions')
        .insert({
          amount,
          user_id: user.id,
          reference,
          currency: 'NGN',
          status: 'pending',
          metadata: { email: user.email }
        });

      if (dbError) throw dbError;

      // Initialize payment with Paystack
      const { data, error } = await supabase.functions.invoke('handle-payment', {
        body: { 
          amount,
          email: user.email,
          metadata: {
            reference,
            user_id: user.id
          }
        }
      });

      if (error) throw error;

      // Redirect to Paystack checkout
      window.location.href = data.data.authorization_url;

      onSuccess?.(reference);
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Could not process payment",
        variant: "destructive",
      });
      onError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className={`bg-red-600 hover:bg-red-700 text-white ${className}`}
    >
      {loading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : children || 'Pay Now'}
    </Button>
  );
};

export default PaystackPaymentButton;
