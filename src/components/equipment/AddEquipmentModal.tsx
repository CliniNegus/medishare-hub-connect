
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ImageUpload } from "@/components/equipment/ImageUpload";

interface AddEquipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEquipmentAdded?: () => void;
}

const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({
  open,
  onOpenChange,
  onEquipmentAdded
}) => {
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
        status: 'Available',
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
      
      // Reset form
      setForm({
        name: '',
        manufacturer: '',
        category: '',
        location: '',
        price: '',
        quantity: '',
      });
      setImageUrl(null);
      
      onOpenChange(false);
      if (onEquipmentAdded) {
        onEquipmentAdded();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-[#333333]">Add New Medical Equipment</DialogTitle>
          <DialogDescription>
            Enter the details of the new medical equipment item.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Equipment Name *</Label>
              <Input 
                id="name" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input 
                id="manufacturer" 
                name="manufacturer" 
                value={form.manufacturer} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                name="category" 
                value={form.category} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location" 
                value={form.location} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                value={form.price} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                id="quantity" 
                name="quantity" 
                type="number" 
                value={form.quantity} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Equipment Image</Label>
            <ImageUpload onImageUploaded={handleImageUploaded} />
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#E02020] hover:bg-[#E02020]/90 text-white"
            >
              {loading ? 'Adding Equipment...' : 'Add Equipment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEquipmentModal;
