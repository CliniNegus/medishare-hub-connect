
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderDetails {
  equipmentName: string;
  quantity: number;
  amount: number;
  shippingAddress?: string;
  estimatedDelivery?: string;
}

export const useOrderEmails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sendOrderConfirmation = async (
    email: string,
    fullName: string | undefined,
    orderId: string,
    orderDetails: OrderDetails
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
        body: {
          email,
          fullName,
          orderId,
          orderDetails,
        },
      });

      if (error) throw new Error(error.message);

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to send order confirmation email');
      }

      toast({
        title: "Order confirmation sent!",
        description: "Customer will receive an email with order details.",
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send order confirmation email';
      setError(errorMessage);
      
      toast({
        title: "Failed to send order confirmation",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendOrderConfirmation,
    loading,
    error,
  };
};
