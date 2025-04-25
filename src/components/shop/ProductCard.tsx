
import React from 'react';
import { ShoppingCart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  inStock: boolean;
  popular: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card key={product.id} className="border border-gray-200 hover:border-red-300 transition-colors">
      <div className="relative h-40 bg-gray-100 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-h-full max-w-full p-4" 
        />
        {product.popular && (
          <Badge className="absolute top-2 left-2 bg-red-600">Popular</Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="outline" className="text-white border-white">Out of Stock</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-sm mb-1">{product.name}</h3>
        <div className="flex items-center mb-2">
          <Badge variant="outline" className="text-xs border-red-200 text-red-700">
            {product.category}
          </Badge>
          <div className="flex items-center ml-2">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs ml-1">{product.rating}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="font-bold text-red-600">${product.price}</div>
          <Button 
            size="sm" 
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
