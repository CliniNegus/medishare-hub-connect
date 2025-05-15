
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ShoppingCart, Star, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  category: string;
  image_url: string;
  description?: string;
  type: string;
}

interface ProductDetailsModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  product, 
  open, 
  onClose,
  onAddToCart
}) => {
  const { toast } = useToast();

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-red-600">{product.name}</DialogTitle>
          <DialogDescription>
            {product.manufacturer} | {product.category}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="relative">
            <AspectRatio ratio={16/9}>
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-md"
              />
            </AspectRatio>
            {product.type !== 'available' && (
              <Badge className="absolute top-2 right-2 bg-amber-100 text-amber-800 border-amber-300">
                Limited
              </Badge>
            )}
          </div>
          
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {product.category}
                </Badge>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4" />
                </div>
              </div>
              <span className="font-bold text-xl text-red-600">${product.price}</span>
            </div>
            
            <div className="border-t pt-2 mt-2">
              <h3 className="font-medium mb-1">Description</h3>
              <p className="text-sm text-gray-600">
                {product.description || `${product.name} - High-quality medical product by ${product.manufacturer}. Designed for professional healthcare facilities.`}
              </p>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Package className="h-4 w-4 mr-1" />
              <span>In stock - Ready to ship</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button 
            onClick={handleAddToCart}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
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
