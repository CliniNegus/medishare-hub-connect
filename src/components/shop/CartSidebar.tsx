
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const CartSidebar = () => {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

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

      // Generate a unique reference for the transaction
      const reference = `cb_cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('Initiating cart payment with data:', {
        totalPrice,
        itemCount: items.length,
        reference,
        email: user.email
      });

      // Prepare cart items for metadata
      const cartItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      }));

      // Create transaction record first
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

      // Initialize payment with Paystack
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

      // Store pending transaction info and redirect to Paystack
      toast({
        title: "Payment Initiated",
        description: "Redirecting to Paystack for payment...",
      });

      // Redirect to Paystack checkout
      window.location.href = data.data.authorization_url;

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Could not process payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your purchase",
        variant: "destructive",
      });
      return;
    }
    setShowCheckoutForm(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">Your Cart ({totalItems})</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            setIsOpen(false);
            setShowCheckoutForm(false);
          }}
          className="rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <ShoppingBag className="h-12 w-12 mb-2" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm">Add some products to your cart</p>
          </div>
        ) : (
          <div className="space-y-4">
            {!showCheckoutForm ? (
              // Cart items display
              <>
                {items.map(item => (
                  <div key={item.id} className="flex border-b pb-4">
                    <div className="h-20 w-20 bg-gray-100 rounded flex-shrink-0">
                      <img 
                        src={item.image_url || "/placeholder.svg"} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-600">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-red-600 font-bold mt-1">Ksh {item.price.toLocaleString()}</div>
                      <div className="flex items-center mt-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 min-w-8 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // Checkout form
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-2">Checkout Details</h3>
                  <div className="text-sm text-gray-600">
                    {totalItems} item(s) • Ksh {totalPrice.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shipping-address">Shipping Address *</Label>
                    <Textarea
                      id="shipping-address"
                      placeholder="Enter your full shipping address"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions or notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {items.length > 0 && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total</span>
            <span className="font-bold text-lg">Ksh {totalPrice.toLocaleString()}</span>
          </div>
          
          {!showCheckoutForm ? (
            <div className="space-y-2">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={handleInitiatePayment}
                disabled={isProcessingPayment || !shippingAddress.trim()}
              >
                {isProcessingPayment ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </div>
                ) : (
                  'Pay with Paystack'
                )}
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => setShowCheckoutForm(false)}
              >
                Back to Cart
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
