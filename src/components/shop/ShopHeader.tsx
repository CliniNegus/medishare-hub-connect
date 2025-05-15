
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

const ShopHeader = () => {
  const { totalItems, setIsOpen } = useCart();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Medical Supplies Shop</h1>
      <div className="relative">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-red-300"
          onClick={() => setIsOpen(true)}
        >
          <ShoppingCart className="h-5 w-5 text-red-600" />
          <span>Cart</span>
          {totalItems > 0 && (
            <Badge className="bg-red-600 text-white ml-1">{totalItems}</Badge>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ShopHeader;
