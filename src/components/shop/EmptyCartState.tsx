
import React from 'react';
import { ShoppingBag } from 'lucide-react';

const EmptyCartState = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500">
      <ShoppingBag className="h-12 w-12 mb-2" />
      <p className="text-lg font-medium">Your cart is empty</p>
      <p className="text-sm">Add some products to your cart</p>
    </div>
  );
};

export default EmptyCartState;
