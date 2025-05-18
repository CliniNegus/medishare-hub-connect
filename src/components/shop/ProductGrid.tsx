
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from '@/components/shop/ProductCard';
import ProductDetailsModal from '@/components/shop/ProductDetailsModal';
import { useProducts, Product } from '@/hooks/use-products';

interface ProductGridProps {
  category?: string;
  searchTerm?: string;
}

const ProductGrid = ({ category = 'all', searchTerm = '' }: ProductGridProps) => {
  const { products, loading } = useProducts({ 
    category: category === 'all' ? undefined : category, 
    searchTerm 
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
            <div className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="p-4 pt-0 flex justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
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
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
      
      <ProductDetailsModal 
        product={selectedProduct}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ProductGrid;
