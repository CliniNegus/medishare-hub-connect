
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from 'lucide-react';

interface ShopHeaderProps {
  cartItemCount: number;
}

const ShopHeader = ({ cartItemCount }: ShopHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Medical Supplies Shop</h1>
      <div className="relative">
        <Button variant="outline" className="flex items-center gap-2 border-red-300">
          <ShoppingCart className="h-5 w-5 text-red-600" />
          <span>Cart ({cartItemCount})</span>
        </Button>
      </div>
    </div>
  );
};

export default ShopHeader;

