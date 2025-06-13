
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Search, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductDetailsModal from '@/components/shop/ProductDetailsModal';
import { Product } from '@/hooks/use-products';

interface ProductsSectionProps {
  products: Product[];
  loading: boolean;
  onViewDetails: (e: React.MouseEvent, product: Product) => void;
}

const ProductsSection = ({ products, loading, onViewDetails }: ProductsSectionProps) => {
  const navigate = useNavigate();

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">All Products</h3>
              <p className="text-sm text-gray-600">Browse our complete medical equipment catalog</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            Loading...
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Card key={idx} className="overflow-hidden border-0 shadow-lg">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
              <CardHeader className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
              </CardContent>
              <CardFooter className="p-4 flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Products</h3>
            <p className="text-sm text-gray-600">Browse our complete medical equipment catalog</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
          {products.length} items
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <Card 
            key={product.id} 
            className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
              <img 
                src={product.image_url || "/placeholder.svg"} 
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              
              {product.stock_quantity <= 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-white shadow-lg">
                    Out of Stock
                  </Badge>
                </div>
              )}
              
              {product.is_featured && (
                <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-700 border-0 shadow-md">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
              
              {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                <Badge variant="outline" className="absolute top-3 right-3 bg-white/90 border-orange-200 text-orange-700">
                  Low Stock
                </Badge>
              )}
            </div>
            
            <CardHeader className="p-4">
              <CardTitle className="text-lg group-hover:text-red-600 transition-colors duration-300 line-clamp-1">
                {product.name}
              </CardTitle>
              <p className="text-sm text-gray-500 font-medium">{product.manufacturer}</p>
            </CardHeader>
            
            <CardContent className="p-4 pt-0 space-y-3">
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-0">
                  {product.category || 'Medical Equipment'}
                </Badge>
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="p-4 flex items-center justify-between">
              <span className="font-bold text-xl text-red-600">Ksh {product.price.toLocaleString()}</span>
              <Button 
                variant="outline"
                size="sm"
                onClick={(e) => onViewDetails(e, product)}
                className="border-gray-200 hover:border-red-300 hover:bg-red-50"
              >
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {!loading && products.length === 0 && (
        <div className="text-center py-16">
          <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default ProductsSection;
