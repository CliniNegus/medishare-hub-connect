
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const CartSidebar = () => {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    toast({
      title: "Proceeding to checkout",
      description: "This would normally redirect to a checkout page",
    });
    // In a real app, this would navigate to checkout
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">Your Cart ({totalItems})</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(false)}
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
          </div>
        )}
      </div>
      
      {items.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total</span>
            <span className="font-bold">Ksh {totalPrice.toLocaleString()}</span>
          </div>
          <Button 
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={handleCheckout}
          >
            Checkout
          </Button>
          <Button 
            variant="outline"
            className="w-full mt-2"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
