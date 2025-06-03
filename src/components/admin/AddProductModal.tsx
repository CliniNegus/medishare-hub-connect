
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AdminProductForm } from './product/AdminProductForm';
import { useAdminProductManagement } from '@/hooks/useAdminProductManagement';

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
  onProductAdded?: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ 
  open, 
  onOpenChange, 
  isAdmin = false,
  onProductAdded
}) => {
  const { toast } = useToast();
  const { handleSubmit, loading } = useAdminProductManagement();

  const onSubmit = async (values: any) => {
    try {
      await handleSubmit(values);
      onOpenChange(false);
      if (onProductAdded) {
        onProductAdded();
      }
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: "Failed to add product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#333333]">
            Add New Product
          </DialogTitle>
          <DialogDescription>
            Enter the details of the new medical product for the shop.
          </DialogDescription>
        </DialogHeader>
        
        <AdminProductForm 
          onSubmit={onSubmit}
          isLoading={loading}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
