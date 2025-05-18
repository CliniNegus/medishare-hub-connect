
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProducts, Product } from '@/hooks/use-products';
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import ProductDetailsModal from './ProductDetailsModal';

const TrendingProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { products, loading } = useProducts({ featured: true });
  
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < products.length - 4 ? prev + 1 : prev));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Trending Products</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="overflow-hidden">
              <div className="h-40 bg-gray-100"></div>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + 4);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Trending Products</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrevious} 
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNext} 
            disabled={currentIndex >= products.length - 4}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {visibleProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="h-40 bg-gray-100 relative">
              <img 
                src={product.image_url || "/placeholder.svg"} 
                alt={product.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h4 className="font-medium mb-1 line-clamp-1">{product.name}</h4>
              <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-red-600">${product.price}</span>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={() => handleViewDetails(product)}
                  >
                    Details
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 px-2 bg-red-600 hover:bg-red-700"
                    onClick={() => addToCart(product)}
                    disabled={product.stock_quantity <= 0}
                  >
                    <ShoppingCart className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProductDetailsModal 
        product={selectedProduct}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default TrendingProducts;
