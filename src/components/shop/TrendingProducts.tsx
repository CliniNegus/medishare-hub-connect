
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronRight, ShoppingCart, Eye } from 'lucide-react';
import { useEquipmentData } from '@/hooks/use-equipment-data';
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from '@/contexts/CartContext';
import { useToast } from "@/hooks/use-toast";
import ProductDetailsModal from './ProductDetailsModal';

const TrendingProducts = () => {
  const { equipment, loading } = useEquipmentData();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // Get the first 4 items for trending products
  const trendingProducts = equipment.slice(0, 4);

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setDetailsModalOpen(true);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Trending Products</h3>
          <Skeleton className="h-8 w-32" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (trendingProducts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Trending Products</h3>
          <Button variant="ghost" className="text-red-600 p-0 hover:bg-transparent">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {trendingProducts.map(product => (
            <Card key={product.id} className="border rounded-lg overflow-hidden">
              <div className="h-32 bg-gray-100 relative">
                <img 
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.type !== 'available' && (
                  <Badge variant="secondary" className="absolute top-2 right-2">Limited Stock</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.manufacturer}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <span className="font-bold text-red-600">${product.price}</span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 w-7 p-0 border-gray-200 hover:bg-gray-50"
                    onClick={() => handleViewDetails(product)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 w-7 p-0 border-red-200 hover:bg-red-50"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-3 w-3" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <ProductDetailsModal
        product={selectedProduct}
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default TrendingProducts;
