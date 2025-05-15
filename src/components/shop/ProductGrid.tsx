
import React, { useState } from 'react';
import { useEquipmentData } from '@/hooks/use-equipment-data';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from '@/components/shop/ProductCard';
import ProductDetailsModal from '@/components/shop/ProductDetailsModal';
import { useCart } from '@/contexts/CartContext';

// Define the product type for better type safety
export interface Product {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  price: number;
  image: string;
  image_url?: string;
  rating: number;
  inStock: boolean;
  popular: boolean;
  type?: string;
}

const ProductGrid = () => {
  const { equipment, loading } = useEquipmentData();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Map equipment data to our Product type
  const products: Product[] = equipment.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category,
    manufacturer: item.manufacturer,
    price: item.price,
    image: item.image_url || "/placeholder.svg",
    rating: 4.5, // Default since equipment data doesn't have ratings
    inStock: item.type === 'available',
    popular: Math.random() > 0.7, // Randomly mark some as popular
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
      
      <ProductDetailsModal 
        product={selectedProduct}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ProductGrid;
