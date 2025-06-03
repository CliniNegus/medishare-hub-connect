
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminProductForm } from '../product/AdminProductForm';

interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  stock_quantity: number;
  manufacturer?: string;
  image_url?: string;
  is_featured?: boolean;
  is_disposable?: boolean;
  sku?: string;
  tags?: string[];
  weight?: number;
  dimensions?: any;
  has_variants?: boolean;
  base_price?: number;
}

interface EditProductModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (productId: string, values: any) => Promise<void>;
  onProductUpdated: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  open,
  onOpenChange,
  onUpdate,
  onProductUpdated
}) => {
  const handleSubmit = async (values: any) => {
    try {
      await onUpdate(product.id, values);
      onProductUpdated();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#333333]">
            Edit Product: {product.name}
          </DialogTitle>
          <DialogDescription>
            Update the product details and manage its variants.
          </DialogDescription>
        </DialogHeader>
        
        <AdminProductForm 
          onSubmit={handleSubmit}
          initialValues={product}
          isLoading={false}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
