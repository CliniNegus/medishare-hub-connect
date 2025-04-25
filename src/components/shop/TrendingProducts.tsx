
import React from 'react';
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ProductCard from './ProductCard';

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

interface TrendingProductsProps {
  products: Product[];
}

const TrendingProducts = ({ products }: TrendingProductsProps) => {
  const trendingProducts = products.filter(product => product.popular);

  return (
    <Card className="border-red-100">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
          Trending Products
        </CardTitle>
        <CardDescription>
          Most popular items purchased by hospitals in your network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingProducts;
