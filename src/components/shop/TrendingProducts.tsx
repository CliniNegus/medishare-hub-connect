
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronRight, ShoppingCart, Eye } from 'lucide-react';
import { useEquipmentData } from '@/hooks/use-equipment-data';
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from '@/contexts/CartContext';
import ProductDetailsModal from './ProductDetailsModal';
import { Product } from './ProductGrid';

const TrendingProducts = () => {
  const { equipment, loading } = useEquipmentData();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Get the first 4 items for trending products
  const trendingProducts = equipment.slice(0, 4);

  // Map to our Product type
  const products: Product[] = trendingProducts.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category,
    manufacturer: item.manufacturer,
    price: item.price,
    image: item.image_url || "/placeholder.svg",
    rating: 4.8, // Default since equipment data doesn't have ratings
    inStock: item.type === 'available',
    popular: true, // All trending products are popular
  }));

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Trending Products</h3>
        <Button variant="ghost" className="text-red-600 p-0 hover:bg-transparent">
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <Card key={product.id} className="border rounded-lg overflow-hidden">
            <div className="h-32 bg-gray-100 relative">
              <img 
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Badge variant="outline" className="text-white border-white">Out of Stock</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.manufacturer}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <span className="font-bold text-red-600">${product.price}</span>
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-gray-200 p-1"
                  onClick={() => handleViewDetails(product)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-red-200 hover:bg-red-50 p-1"
                  onClick={() => addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                  })}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-3 w-3" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <ProductDetailsModal 
        product={selectedProduct}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TrendingProducts;
