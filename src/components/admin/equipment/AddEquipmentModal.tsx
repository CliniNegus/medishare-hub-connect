
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/equipment/ImageUpload';

interface AddEquipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEquipmentAdded?: () => void;
}

interface EquipmentFormData {
  name: string;
  manufacturer: string;
  category: string;
  description: string;
  model: string;
  serial_number: string;
  condition: string;
  location: string;
  status: string;
  price: string;
  lease_rate: string;
  quantity: string;
  specs: string;
  image_url: string;
  sales_option: string;
  usage_hours: string;
  downtime_hours: string;
  revenue_generated: string;
  remote_control_enabled: boolean;
  pay_per_use_enabled: boolean;
  pay_per_use_price: string;
}

const INITIAL_FORM_DATA: EquipmentFormData = {
  name: '',
  manufacturer: '',
  category: '',
  description: '',
  model: '',
  serial_number: '',
  condition: '',
  location: '',
  status: 'available',
  price: '',
  lease_rate: '',
  quantity: '1',
  specs: '',
  image_url: '',
  sales_option: 'both',
  usage_hours: '0',
  downtime_hours: '0',
  revenue_generated: '0',
  remote_control_enabled: false,
  pay_per_use_enabled: false,
  pay_per_use_price: '',
};

const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({
  open,
  onOpenChange,
  onEquipmentAdded
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EquipmentFormData>(INITIAL_FORM_DATA);

  const handleInputChange = (field: keyof EquipmentFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({
      ...prev,
      image_url: url
    }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Equipment name is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
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

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const equipmentData = {
        name: formData.name.trim(),
        manufacturer: formData.manufacturer.trim() || null,
        category: formData.category || null,
        description: formData.description.trim() || null,
        model: formData.model.trim() || null,
        serial_number: formData.serial_number.trim() || null,
        condition: formData.condition || null,
        location: formData.location.trim() || null,
        status: formData.status,
        price: formData.price ? parseFloat(formData.price) : null,
        lease_rate: formData.lease_rate ? parseFloat(formData.lease_rate) : null,
        quantity: formData.quantity ? parseInt(formData.quantity) : 1,
        specs: formData.specs.trim() || null,
        image_url: formData.image_url || null,
        owner_id: user.id,
        usage_hours: formData.usage_hours ? parseInt(formData.usage_hours) : 0,
        downtime_hours: formData.downtime_hours ? parseInt(formData.downtime_hours) : 0,
        revenue_generated: formData.revenue_generated ? parseFloat(formData.revenue_generated) : 0,
        remote_control_enabled: formData.remote_control_enabled,
        sales_option: formData.sales_option || null,
        pay_per_use_enabled: formData.pay_per_use_enabled,
        pay_per_use_price: formData.pay_per_use_enabled && formData.pay_per_use_price ? parseFloat(formData.pay_per_use_price) : null
      };

      console.log("Submitting equipment data:", equipmentData);

      const { data, error } = await supabase
        .from('equipment')
        .insert([equipmentData])
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      console.log("Equipment added successfully:", data);

      toast({
        title: "Equipment Added Successfully",
        description: `${formData.name} has been added to the inventory`,
      });

      resetForm();
      onOpenChange(false);
      
      if (onEquipmentAdded) {
        onEquipmentAdded();
      }

    } catch (error: any) {
      console.error('Error adding equipment:', error);
      toast({
        title: "Failed to add equipment",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#333333]">Add New Equipment</DialogTitle>
          <DialogDescription>
            Enter the details of the new medical equipment item. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Equipment Image</Label>
            <ImageUpload 
              onImageUploaded={handleImageUploaded}
              currentImageUrl={formData.image_url}
            />
          </div>

          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#333333] border-b border-gray-200 pb-2">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Equipment Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter equipment name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  placeholder="Enter manufacturer name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Enter model"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serial_number">Serial Number</Label>
                <Input
                  id="serial_number"
                  value={formData.serial_number}
                  onChange={(e) => handleInputChange('serial_number', e.target.value)}
                  placeholder="Enter serial number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
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
                <Select
                  value={formData.condition}
                  onValueChange={(value) => handleInputChange('condition', value)}
                >
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
            </div>
          </div>

          {/* Location & Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#333333] border-b border-gray-200 pb-2">
              Location & Status
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="leased">Leased</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="Enter quantity"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Sales Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#333333] border-b border-gray-200 pb-2">
              Pricing & Sales Options
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Purchase Price (Ksh)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="Enter purchase price in KES"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lease_rate">Lease Rate (Ksh/month)</Label>
                <Input
                  id="lease_rate"
                  type="number"
                  step="0.01"
                  value={formData.lease_rate}
                  onChange={(e) => handleInputChange('lease_rate', e.target.value)}
                  placeholder="Enter monthly lease rate in KES"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sales_option">Sales Option</Label>
                <Select
                  value={formData.sales_option}
                  onValueChange={(value) => handleInputChange('sales_option', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sales option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct_sale">Direct Sale Only</SelectItem>
                    <SelectItem value="lease">Lease Only</SelectItem>
                    <SelectItem value="both">Both Sale & Lease</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pay Per Use Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#333333] border-b border-gray-200 pb-2">
              Pay Per Use Options
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pay_per_use_enabled"
                  checked={formData.pay_per_use_enabled}
                  onChange={(e) => handleInputChange('pay_per_use_enabled', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="pay_per_use_enabled">Enable Pay Per Use</Label>
              </div>

              {formData.pay_per_use_enabled && (
                <div className="space-y-2">
                  <Label htmlFor="pay_per_use_price">Daily Rate (Ksh)</Label>
                  <Input
                    id="pay_per_use_price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.pay_per_use_price}
                    onChange={(e) => handleInputChange('pay_per_use_price', e.target.value)}
                    placeholder="Enter price per use in KES"
                    required={formData.pay_per_use_enabled}
                  />
                  <p className="text-sm text-gray-500">
                    This is the amount users will be charged per calendar day
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Analytics & Performance Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#333333] border-b border-gray-200 pb-2">
              Analytics & Performance
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usage_hours">Usage Hours</Label>
                <Input
                  id="usage_hours"
                  type="number"
                  min="0"
                  value={formData.usage_hours}
                  onChange={(e) => handleInputChange('usage_hours', e.target.value)}
                  placeholder="Enter usage hours"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="downtime_hours">Downtime Hours</Label>
                <Input
                  id="downtime_hours"
                  type="number"
                  min="0"
                  value={formData.downtime_hours}
                  onChange={(e) => handleInputChange('downtime_hours', e.target.value)}
                  placeholder="Enter downtime hours"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenue_generated">Revenue Generated (Ksh)</Label>
                <Input
                  id="revenue_generated"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.revenue_generated}
                  onChange={(e) => handleInputChange('revenue_generated', e.target.value)}
                  placeholder="Enter revenue generated in KES"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remote_control_enabled"
                  checked={formData.remote_control_enabled}
                  onChange={(e) => handleInputChange('remote_control_enabled', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="remote_control_enabled">Enable Remote Control</Label>
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#333333] border-b border-gray-200 pb-2">
              Additional Details
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="specs">Specifications</Label>
                <Textarea
                  id="specs"
                  value={formData.specs}
                  onChange={(e) => handleInputChange('specs', e.target.value)}
                  placeholder="Enter detailed specifications..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter equipment description..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
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
              disabled={loading || !formData.name.trim()}
              className="bg-[#E02020] hover:bg-[#E02020]/90"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Equipment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEquipmentModal;
