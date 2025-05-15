
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from 'lucide-react';

const ShopHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Medical Supplies Shop</h1>
      <Button 
        variant="outline" 
        className="flex items-center gap-2 border-red-300"
      >
        <ShoppingCart className="h-5 w-5 text-red-600" />
        <span>Cart (0)</span>
      </Button>
    </div>
  );
};

export default ShopHeader;
