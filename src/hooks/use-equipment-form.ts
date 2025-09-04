
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
    quantity: '1',
    description: '',
    model: '',
    condition: '',
    serial_number: '',
    pay_per_use_enabled: false,
    pay_per_use_price: '',
  });
  
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: checked,
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
      quantity: '1',
      description: '',
      model: '',
      condition: '',
      serial_number: '',
      pay_per_use_enabled: false,
      pay_per_use_price: '',
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

    if (!form.name || !form.manufacturer) {
      toast({
        title: "Required fields missing",
        description: "Please fill in equipment name and manufacturer",
        variant: "destructive",
      });
      return;
    }

    // Validate pay per use price if enabled
    if (form.pay_per_use_enabled && (!form.pay_per_use_price || parseFloat(form.pay_per_use_price) <= 0)) {
      toast({
        title: "Invalid daily rate",
        description: "Please enter a valid daily rate greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log("Starting submission with form data:", form);
      
      // Prepare data for database insertion
      const equipmentData = {
        name: form.name,
        manufacturer: form.manufacturer,
        category: form.category || null,
        location: form.location || null,
        price: form.price ? parseFloat(form.price) : null,
        quantity: form.quantity ? parseInt(form.quantity) : 1,
        description: form.description || null,
        model: form.model || null,
        condition: form.condition || null,
        serial_number: form.serial_number || null,
        pay_per_use_enabled: form.pay_per_use_enabled,
        pay_per_use_price: form.pay_per_use_enabled && form.pay_per_use_price ? parseFloat(form.pay_per_use_price) : null,
        image_url: imageUrl,
        owner_id: user.id,
        status: 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log("Inserting equipment data:", equipmentData);
      
      const { data, error } = await supabase.from('equipment').insert([equipmentData]).select();
      
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      console.log("Equipment added successfully:", data);
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
      const bucketReady = await createEquipmentImagesBucket();
      if (bucketReady) {
        console.log("Equipment images bucket is ready");
        return true;
      } else {
        console.error("Failed to initialize equipment images bucket");
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
    handleSelectChange,
    handleCheckboxChange,
    handleImageUploaded,
    handleSubmit,
    resetForm,
    initializeStorage
  };
};
