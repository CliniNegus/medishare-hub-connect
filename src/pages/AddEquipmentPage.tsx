
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from '@/components/products/ProductForm';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ProductFormValues } from '@/types/product';
import { createEquipmentImagesBucket } from '@/integrations/supabase/createStorageBucket';
import Layout from '@/components/Layout';

const AddEquipmentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    // Ensure the storage bucket exists
    createEquipmentImagesBucket();
  }, []);

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
          throw uploadError;
        }

        console.log("Upload successful, getting public URL");
        const { data: { publicUrl } } = supabase.storage
          .from('equipment_images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
        console.log("Generated public URL:", imageUrl);
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
        year_manufactured: values.year_manufactured,
        serial_number: values.serial_number || null,
        specs: values.specs,
        image_url: imageUrl,
        owner_id: user.id,
        status: 'Available',
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
        throw error;
      }
      
      console.log("Product added successfully:", data);
      toast({
        title: "Product Added Successfully",
        description: `${values.name} has been added to your inventory`,
      });
      
      // Navigate back to equipment page
      navigate('/equipment-management');
      
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
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-red-600">Add New Equipment</h1>
        </div>
        
        <ProductForm 
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          isEditing={false}
          onCancel={() => navigate(-1)}
        />
      </div>
    </Layout>
  );
};

export default AddEquipmentPage;
