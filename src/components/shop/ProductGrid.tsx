
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from '@/components/shop/ProductCard';
import ProductDetailsModal from '@/components/shop/ProductDetailsModal';
import ProductFormDialog from '@/components/manufacturer/products/ProductFormDialog';
import { useProducts, Product, ProductFilterOptions } from '@/hooks/use-products';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductGridProps {
  filterOptions?: ProductFilterOptions;
}

const ProductGrid = ({ filterOptions = {} }: ProductGridProps) => {
  const { products, loading, totalCount } = useProducts(filterOptions);
  const { user, userRoles } = useAuth();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditProduct(null);
  };

  const handleUpdateProduct = async (values: any) => {
    if (!editProduct || !user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('products')
        .update({
          name: values.name,
          description: values.description,
          category: values.category,
          price: values.price,
          stock_quantity: values.stock_quantity,
          manufacturer: values.manufacturer,
          image_url: values.image_url,
          is_featured: values.is_featured,
          is_disposable: values.is_disposable,
          sku: values.sku,
          tags: values.tags,
          weight: values.weight,
          dimensions: values.dimensions,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editProduct.id);

      if (error) throw error;

      toast({
        title: "Product updated",
        description: `${values.name} has been updated successfully`,
      });

      // Refresh the page to show updates
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating product:', error.message);
      toast({
        title: "Failed to update product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Check if user can edit a specific product
  const canEditProduct = (product: Product) => {
    return userRoles.isAdmin || (user?.id && product.manufacturer_id === user.id);
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
            onEdit={canEditProduct(product) ? handleEditProduct : undefined}
          />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
      
      {totalCount > 0 && (
        <div className="text-sm text-gray-500 mt-4">
          Showing {products.length} of {totalCount} products
        </div>
      )}
      
      <ProductDetailsModal 
        product={selectedProduct}
        open={modalOpen}
        onClose={handleCloseModal}
        onEdit={selectedProduct && canEditProduct(selectedProduct) ? handleEditProduct : undefined}
      />

      {editProduct && (
        <ProductFormDialog
          open={editModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateProduct}
          initialValues={editProduct}
          isLoading={saving}
        />
      )}
    </>
  );
};

export default ProductGrid;
