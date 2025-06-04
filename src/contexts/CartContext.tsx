
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: { id: string; name: string; price: number; image_url?: string | null; quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (item: { id: string; name: string; price: number; image_url?: string | null; quantity?: number }) => {
    const quantityToAdd = item.quantity || 1;
    
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(cartItem => cartItem.id === item.id);
      if (existingItemIndex > -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantityToAdd;
        return updatedItems;
      } else {
        return [...currentItems, { ...item, quantity: quantityToAdd }];
      }
    });
    setIsOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      isOpen,
      setIsOpen,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
