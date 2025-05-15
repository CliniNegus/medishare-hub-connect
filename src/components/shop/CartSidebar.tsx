
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ open, onOpenChange }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    toast({
      title: "Checkout started",
      description: "This is where the checkout process would begin",
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-red-600" />
            Shopping Cart
          </SheetTitle>
        </SheetHeader>
        
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <SheetClose asChild>
              <Button variant="outline" className="mt-4">
                Continue Shopping
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center py-3 border-b">
                  <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden mr-3">
                    <img 
                      src={item.image_url || "/placeholder.svg"} 
                      alt={item.name} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-red-600 font-medium">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-6 w-6 rounded-full"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-6 w-6 rounded-full"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="ml-2 text-red-500 hover:text-red-700 hover:bg-transparent"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              
              <Button 
                className="bg-red-600 hover:bg-red-700 w-full mb-2"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <SheetClose asChild>
                  <Button variant="outline" className="flex-1">
                    Continue Shopping
                  </Button>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
