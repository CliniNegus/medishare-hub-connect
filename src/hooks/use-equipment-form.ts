
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createEquipmentImagesBucket } from '@/integrations/supabase/createStorageBucket';

interface UseEquipmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useEquipmentForm = ({ onSuccess, onCancel }: UseEquipmentFormProps = {}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [form, setForm] = useState({
    name: '',
    manufacturer: '',
    category: '',
    location: '',
    price: '',
    quantity: '',
  });
  
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUploaded = (url: string) => {
    console.log("Image uploaded, URL:", url);
    setImageUrl(url);
  };

  const resetForm = () => {
    setForm({
      name: '',
      manufacturer: '',
      category: '',
      location: '',
      price: '',
      quantity: '',
    });
    setImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add equipment",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log("Starting submission with form data:", form);
      console.log("User ID:", user.id);
      console.log("Image URL:", imageUrl);
      
      // Process the uploaded image if using base64
      let finalImageUrl = imageUrl;
      if (imageUrl && imageUrl.startsWith('data:')) {
        console.log("Processing base64 image...");
        try {
          const base64Data = imageUrl.split(',')[1];
          const fileData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          const fileName = `equipment_${Date.now()}_${Math.random().toString(36).substring(2)}.jpg`;
          
          const file = new File([fileData], fileName, { type: 'image/jpeg' });
          console.log("Created file object for upload:", fileName);

          console.log("Uploading to equipment_images bucket...");
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('equipment_images')
            .upload(fileName, file);

          if (uploadError) {
            console.error("Upload error:", uploadError);
            throw uploadError;
          }

          console.log("Upload successful:", uploadData);
          const { data: { publicUrl } } = supabase.storage
            .from('equipment_images')
            .getPublicUrl(fileName);

          finalImageUrl = publicUrl;
          console.log("Generated public URL:", finalImageUrl);
        } catch (imgError: any) {
          console.error("Image processing error:", imgError);
          toast({
            title: "Image upload failed",
            description: imgError.message || "Could not process the image",
            variant: "destructive",
          });
          // Continue with submission without the image
          finalImageUrl = null;
        }
      }
      
      // Prepare data for database insertion
      const equipmentData = {
        name: form.name,
        manufacturer: form.manufacturer,
        category: form.category,
        location: form.location,
        price: form.price ? parseFloat(form.price) : null,
        quantity: form.quantity ? parseInt(form.quantity) : null,
        image_url: finalImageUrl,
        owner_id: user.id,
        status: 'available',  // Changed from 'Available' to 'available'
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log("Inserting equipment data:", equipmentData);
      
      const { data, error } = await supabase.from('equipment').insert([equipmentData]).select();
      
      console.log("Insert response data:", data);
      
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      toast({
        title: "Equipment Added Successfully",
        description: `${form.name} has been added to the inventory`,
      });
      
      resetForm();
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error('Error adding equipment:', error.message);
      toast({
        title: "Failed to add equipment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize storage bucket if needed
  const initializeStorage = async () => {
    try {
      const bucketCreated = await createEquipmentImagesBucket();
      if (!bucketCreated) {
        console.warn("Failed to initialize equipment images storage bucket");
      }
    } catch (error) {
      console.error("Error initializing storage:", error);
    }
  };

  return {
    form,
    loading,
    imageUrl,
    handleChange,
    handleImageUploaded,
    handleSubmit,
    resetForm,
    initializeStorage
  };
};
