
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/contexts/CartContext';

interface UseCartPaymentProps {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  street: string;
  city: string;
  country: string;
  zipCode: string;
  notes: string;
}

export const useCartPayment = ({ items, totalPrice, totalItems, fullName, phoneNumber, email, street, city, country, zipCode, notes }: UseCartPaymentProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

  // Handle visibility change to detect when user returns from Paystack
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isProcessingPayment) {
        setTimeout(() => {
          setIsProcessingPayment(false);
          console.log('Cart payment process reset due to page visibility change');
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
          return;
        }
        
        setTimeout(() => {
          setIsProcessingPayment(false);
          toast({
            title: "Payment Cancelled",
            description: "Cart payment was not completed. You can try again.",
            variant: "destructive",
          });
        }, 1000);
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
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

    // Validate required shipping fields
    if (!fullName.trim() || !phoneNumber.trim() || !email.trim() || !street.trim() || !city.trim() || !country.trim()) {
      toast({
        title: "Shipping information required",
        description: "Please fill in all required shipping fields",
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

      // Create comprehensive shipping information object
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

      // Store transaction with detailed shipping information
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
            shipping_info: shippingInfo,
            shipping_address_id: shippingAddressId,
            customer_id: customerData.id,
            notes: notes,
            item_count: totalItems,
            order_type: 'cart_checkout'
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
          amount: totalPrice,
          payment_method: 'paystack',
          shipping_address: shippingInfo.full_address,
          notes: notes,
          status: 'pending'
        });

      if (orderError) {
        console.error('Order creation error:', orderError);
        // Continue with payment even if order creation fails
      }

      const { data, error } = await supabase.functions.invoke('handle-payment', {
        body: { 
          amount: totalPrice,
          email: user.email,
          metadata: {
            reference,
            user_id: user.id,
            cart_items: cartItems,
            shipping_info: shippingInfo,
            shipping_address_id: shippingAddressId,
            customer_id: customerData.id,
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
