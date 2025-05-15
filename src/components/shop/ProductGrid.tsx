
import React from 'react';
import { useEquipmentData } from '@/hooks/use-equipment-data';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductGrid = () => {
  const { equipment, loading } = useEquipmentData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {equipment.map(product => (
        <Card key={product.id} className="overflow-hidden">
          <div className="h-48 relative">
            <img 
              src={product.image_url || "/placeholder.svg"} 
              alt={product.name} 
              className="h-full w-full object-cover"
            />
            {product.type !== 'available' && (
              <Badge className="absolute top-2 right-2 bg-amber-100 text-amber-800 border-amber-300">
                Limited
              </Badge>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium text-sm">{product.name}</h3>
            <p className="text-xs text-gray-500 my-1">{product.manufacturer}</p>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <div className="font-bold text-red-600">${product.price}</div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="border-gray-300 hover:border-gray-400"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                className="bg-red-600 hover:bg-red-700"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
