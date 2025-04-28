
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductFormValues } from '@/types/product';

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
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: ProductFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add products",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      let imageUrl = values.image_url;
      if (imageUrl && imageUrl.startsWith('data:')) {
        // Convert base64 to file and upload
        const base64Data = imageUrl.split(',')[1];
        const fileData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const fileName = `${Math.random().toString(36).substring(7)}.jpg`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('equipment_images')
          .upload(fileName, fileData.buffer, {
            contentType: 'image/jpeg'
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('equipment_images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }
      
      const productData = {
        name: values.name,
        description: values.description,
        category: values.category,
        price: values.price,
        lease_rate: values.lease_rate || Math.round(values.price * 0.05),
        condition: values.condition,
        manufacturer: values.manufacturer,
        model: values.model,
        specs: values.specs,
        image_url: imageUrl,
        owner_id: user.id,
        status: 'Available',
        available_inventory: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('equipment')
        .insert(productData);
        
      if (error) throw error;
      
      toast({
        title: "Product Added Successfully",
        description: `${values.name} has been added to your inventory`,
      });
      
      onOpenChange(false);
      if (onProductAdded) {
        onProductAdded();
      }
      
    } catch (error: any) {
      console.error('Error adding product:', error.message);
      toast({
        title: "Failed to add product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#333333]">Add New Product</DialogTitle>
          <DialogDescription>
            Enter the details of the new medical equipment item.
          </DialogDescription>
        </DialogHeader>
        
        <ProductForm 
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          isEditing={false}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
