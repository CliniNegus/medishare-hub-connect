
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/equipment/ImageUpload";

interface EquipmentFormProps {
  form: {
    name: string;
    manufacturer: string;
    category: string;
    location: string;
    price: string;
    quantity: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageUploaded: (url: string) => void;
}

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  form,
  handleChange,
  handleImageUploaded
}) => {
  return (
    <>
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
    </>
  );
};
