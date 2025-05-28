
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/equipment/ImageUpload";

interface EquipmentFormProps {
  form: {
    name: string;
    manufacturer: string;
    category: string;
    location: string;
    price: string;
    quantity: string;
    description?: string;
    model?: string;
    condition?: string;
    serial_number?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange?: (field: string, value: string) => void;
  handleImageUploaded: (url: string) => void;
}

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  form,
  handleChange,
  handleSelectChange,
  handleImageUploaded
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Equipment Name *</Label>
          <Input 
            id="name" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="e.g., MRI Scanner X9"
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
            placeholder="e.g., GE Healthcare"
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input 
            id="model" 
            name="model" 
            value={form.model || ''} 
            onChange={handleChange} 
            placeholder="e.g., Signa Pioneer"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select onValueChange={(value) => handleSelectChange?.('category', value)} value={form.category}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Imaging">Imaging Equipment</SelectItem>
              <SelectItem value="Patient Monitoring">Patient Monitoring</SelectItem>
              <SelectItem value="Laboratory">Laboratory Equipment</SelectItem>
              <SelectItem value="Surgical">Surgical Equipment</SelectItem>
              <SelectItem value="Respiratory">Respiratory Equipment</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select onValueChange={(value) => handleSelectChange?.('condition', value)} value={form.condition || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Refurbished">Refurbished</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            name="location" 
            value={form.location} 
            onChange={handleChange} 
            placeholder="e.g., Main Hospital - Room 205"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            value={form.price} 
            onChange={handleChange} 
            placeholder="0.00"
            min="0"
            step="0.01"
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
            placeholder="1"
            min="1"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="serial_number">Serial Number</Label>
          <Input 
            id="serial_number" 
            name="serial_number" 
            value={form.serial_number || ''} 
            onChange={handleChange} 
            placeholder="e.g., SN123456789"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={form.description || ''} 
          onChange={handleChange} 
          placeholder="Detailed description of the equipment, its features, and specifications..."
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Equipment Image</Label>
        <ImageUpload onImageUploaded={handleImageUploaded} />
      </div>
    </div>
  );
};
