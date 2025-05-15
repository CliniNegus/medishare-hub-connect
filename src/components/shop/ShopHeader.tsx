
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartSidebar from './CartSidebar';

const ShopHeader = () => {
  const { cartCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Medical Supplies Shop</h1>
        <div className="relative">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-red-300"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5 text-red-600" />
            <span>Cart ({cartCount})</span>
          </Button>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </div>

      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};

export default ShopHeader;
