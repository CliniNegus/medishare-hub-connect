
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
  fullName: string;
  phoneNumber: string;
  email: string;
  street: string;
  city: string;
  country: string;
  zipCode: string;
  onSuccess?: (reference: string) => void;
  onError?: (error: string) => void;
}

export const usePaystackPayment = ({
  amount,
  equipmentId,
  equipmentName,
  shippingAddress,
  notes,
  fullName,
  phoneNumber,
  email,
  street,
  city,
  country,
  zipCode,
  onSuccess,
  onError
}: UsePaystackPaymentProps) => {
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

      // Create or update customer and shipping address
      const { data: shippingAddressData, error: shippingError } = await supabase
        .rpc('create_or_update_customer_with_shipping', {
          p_user_id: user.id,
          p_full_name: fullName,
          p_phone_number: phoneNumber,
          p_email: email,
          p_street: street,
          p_city: city,
          p_country: country,
          p_zip_code: zipCode
        });

      if (shippingError) {
        console.error('Shipping address creation error:', shippingError);
        throw new Error('Failed to save shipping information');
      }

      const shippingAddressId = shippingAddressData;

      // Get customer ID
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (customerError) {
        console.error('Customer lookup error:', customerError);
        throw new Error('Failed to retrieve customer information');
      }

      const shippingInfo = {
        full_name: fullName,
        phone_number: phoneNumber,
        email: email,
        street: street,
        city: city,
        country: country,
        zip_code: zipCode,
        full_address: `${street}, ${city}, ${country} ${zipCode}`
      };

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
            notes: notes,
            shipping_info: shippingInfo,
            shipping_address_id: shippingAddressId,
            customer_id: customerData.id,
            order_type: 'purchase'
          }
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to create transaction record');
      }

      // Create an order record with proper shipping information
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_id: customerData.id,
          shipping_address_id: shippingAddressId,
          shipping_full_name: fullName,
          shipping_phone_number: phoneNumber,
          shipping_email: email,
          amount: amount,
          payment_method: 'paystack',
          shipping_address: shippingAddress,
          notes: notes,
          equipment_id: equipmentId,
          status: 'pending'
        });

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error('Failed to create order record');
      }

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

  return {
    loading,
    setLoading,
    handlePayment
  };
};
