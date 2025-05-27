
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
      
      // Prepare data for database insertion
      const equipmentData = {
        name: form.name,
        manufacturer: form.manufacturer,
        category: form.category,
        location: form.location,
        price: form.price ? parseFloat(form.price) : null,
        quantity: form.quantity ? parseInt(form.quantity) : null,
        image_url: imageUrl,
        owner_id: user.id,
        status: 'available',
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

  // Storage bucket check function
  const initializeStorage = async () => {
    try {
      // Check if bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (error) {
        console.error("Error checking storage buckets:", error);
        return false;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'equipment_images');
      if (bucketExists) {
        console.log("Equipment images bucket is ready");
        return true;
      } else {
        console.error("Equipment images bucket not found");
        return false;
      }
    } catch (error) {
      console.error("Error initializing storage:", error);
      return false;
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
