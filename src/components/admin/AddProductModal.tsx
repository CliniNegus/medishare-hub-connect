
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductFormValues } from '@/types/product';
import { useShopData } from '@/hooks/use-shop-data';
import ShopSelector from './product/ShopSelector';
import ModalHeader from './product/ModalHeader';
import { createEquipmentImagesBucket } from '@/integrations/supabase/createStorageBucket';

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
  
  const { 
    shops, 
    selectedShop, 
    setSelectedShop, 
    loading: shopsLoading 
  } = useShopData(isAdmin, open);

  // Initialize bucket on component mount
  React.useEffect(() => {
    if (open) {
      createEquipmentImagesBucket()
        .then(success => {
          if (!success) {
            console.warn("Failed to initialize storage bucket for equipment images");
          }
        });
    }
  }, [open]);

  const handleSubmit = async (values: ProductFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add products",
        variant: "destructive",
      });
      return;
    }

    // For non-admin manufacturers, check if they have at least one shop
    if (!isAdmin && (!shops || shops.length === 0)) {
      toast({
        title: "Shop required",
        description: "You need to create a virtual shop before adding products. Please go to 'Manage Virtual Shops' first.",
        variant: "destructive",
      });
      return;
    }

    // For admins, require shop selection
    if (isAdmin && !selectedShop) {
      toast({
        title: "Shop selection required",
        description: "Please select a shop for this product",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Starting product submission process");
      
      let imageUrl = values.image_url;
      if (imageUrl && imageUrl.startsWith('data:')) {
        console.log("Processing image upload");
        // Convert base64 to file and upload
        const base64Data = imageUrl.split(',')[1];
        const fileData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.jpg`;
        
        console.log("Creating file for upload");
        const file = new File([fileData], fileName, { type: 'image/jpeg' });

        console.log("Uploading to storage:", fileName);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('equipment_images')
          .upload(fileName, file);

        if (uploadError) {
          console.error("Image upload error:", uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        console.log("Upload successful, getting public URL");
        const { data: { publicUrl } } = supabase.storage
          .from('equipment_images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
        console.log("Generated public URL:", imageUrl);
      }
      
      // For manufacturers, use their first shop if not admin
      const shopId = isAdmin ? selectedShop : (shops && shops.length > 0 ? shops[0].id : null);

      const productData = {
        name: values.name,
        description: values.description,
        category: values.category,
        price: values.price,
        lease_rate: values.lease_rate || Math.round(values.price * 0.05),
        condition: values.condition,
        manufacturer: values.manufacturer,
        model: values.model,
        year_manufactured: values.year_manufactured,
        serial_number: values.serial_number || null,
        specs: values.specs,
        image_url: imageUrl,
        owner_id: user.id,
        shop_id: shopId,
        status: 'Available',
        sales_option: values.sales_option,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Inserting product data:", productData);
      const { error, data } = await supabase
        .from('equipment')
        .insert(productData)
        .select();
        
      if (error) {
        console.error("Database insert error:", error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log("Product added successfully:", data);
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
        <ModalHeader 
          title="Add New Product" 
          description="Enter the details of the new medical equipment item." 
        />
        
        {isAdmin && (
          <ShopSelector 
            shops={shops}
            selectedShop={selectedShop}
            onShopSelect={setSelectedShop}
            loading={shopsLoading}
          />
        )}

        {!isAdmin && shops && shops.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Adding to shop:</strong> {shops[0].name} ({shops[0].country})
            </p>
          </div>
        )}
        
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
