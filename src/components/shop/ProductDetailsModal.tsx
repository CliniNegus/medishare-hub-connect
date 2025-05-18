
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, X } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/hooks/use-products';

interface ProductDetailsModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const ProductDetailsModal = ({ product, open, onClose }: ProductDetailsModalProps) => {
  const { addToCart } = useCart();
  
  if (!product) return null;
  
  const inStock = product.stock_quantity > 0;
  
  const handleAddToCart = () => {
    if (inStock) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute right-4 top-4 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-100 rounded-md p-4 flex items-center justify-center h-44">
            <img 
              src={product.image_url || "/placeholder.svg"} 
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <Badge variant="outline" className="text-xs border-red-200 text-red-700">
                {product.category || 'Uncategorized'}
              </Badge>
              {product.rating && (
                <div className="flex items-center ml-2">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs ml-1">{product.rating}</span>
                </div>
              )}
              {product.is_featured && (
                <Badge className="ml-2 bg-red-600">Popular</Badge>
              )}
            </div>
            
            <div className="font-bold text-red-600 text-xl mb-2">${product.price}</div>
            
            <p className="text-sm text-gray-600 mb-4">
              {product.description || "No description available for this product."}
            </p>
            
            {!inStock && (
              <Badge variant="outline" className="mb-2 border-red-300 text-red-600">
                Currently Out of Stock
              </Badge>
            )}
            
            {product.manufacturer && (
              <p className="text-xs text-gray-500">Manufacturer: {product.manufacturer}</p>
            )}
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button 
            className="bg-red-600 hover:bg-red-700 w-full"
            disabled={!inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
