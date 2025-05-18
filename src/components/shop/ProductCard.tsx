
import React from 'react';
import { ShoppingCart, Star, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/hooks/use-products";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const { addToCart } = useCart();
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
    <Card key={product.id} className="border border-gray-200 hover:border-red-300 transition-colors">
      <div className="relative h-40 bg-gray-100 flex items-center justify-center">
        <img 
          src={product.image_url || "/placeholder.svg"} 
          alt={product.name} 
          className="max-h-full max-w-full p-4" 
        />
        {product.is_featured && (
          <Badge className="absolute top-2 left-2 bg-red-600">Popular</Badge>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="outline" className="text-white border-white">Out of Stock</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-sm mb-1">{product.name}</h3>
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
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="font-bold text-red-600">${product.price}</div>
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="outline"
              className="border-gray-200"
              onClick={() => onViewDetails(product)}
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={!inStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
