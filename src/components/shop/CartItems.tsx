
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, Plus, Minus } from 'lucide-react';
import { CartItem } from '@/contexts/CartContext';

interface CartItemsProps {
  items: CartItem[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

const CartItems = ({ items, removeFromCart, updateQuantity }: CartItemsProps) => {
  return (
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
  );
};

export default CartItems;
