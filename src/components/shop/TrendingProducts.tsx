
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ChevronLeft, ChevronRight, Star, TrendingUp, Eye } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import ProductDetailsModal from './ProductDetailsModal';
import { useTrendingProducts } from '@/hooks/use-trending-products';
import { Product } from '@/hooks/use-products';
import { useNavigate } from 'react-router-dom';

const TrendingProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { products, loading } = useTrendingProducts();
  const navigate = useNavigate();
  
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCardClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < products.length - 4 ? prev + 1 : prev));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="overflow-hidden border-0 shadow-lg">
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
              <CardContent className="p-5">
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
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
            <TrendingUp className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Trending Products</h3>
            <p className="text-sm text-gray-600">Most popular items this week</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrevious} 
            disabled={currentIndex === 0}
            className="h-10 w-10 rounded-full border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNext} 
            disabled={currentIndex >= products.length - 4}
            className="h-10 w-10 rounded-full border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {visibleProducts.map((product) => (
          <Card 
            key={product.id} 
            className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer"
            onClick={() => handleCardClick(product)}
          >
            <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
              <img 
                src={product.image_url || "/placeholder.svg"} 
                alt={product.name} 
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              
              {product.is_featured && (
                <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-700 border-0 shadow-md">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              
              {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                <Badge variant="outline" className="absolute top-3 right-3 bg-white/90 border-orange-200 text-orange-700">
                  Low Stock
                </Badge>
              )}
              
              {product.stock_quantity <= 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-white shadow-lg">Out of Stock</Badge>
                </div>
              )}
            </div>
            
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                  {product.name}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-0">
                  {product.category}
                </Badge>
                {product.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-1">
                  <span className="text-xl font-bold text-red-600">Ksh {product.price.toLocaleString()}</span>
                  <p className="text-xs text-gray-500">{product.manufacturer}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-3 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(product);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="primary-red"
                    className="h-9 px-3 shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    disabled={product.stock_quantity <= 0}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add
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
