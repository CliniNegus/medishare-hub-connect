
import React, { useState, useEffect } from 'react';
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
import { Equipment } from '@/hooks/useEquipmentManagement';
import { Loader2 } from 'lucide-react';

interface EquipmentEditModalProps {
  equipment: Equipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<Equipment>) => Promise<Equipment>;
}

const EquipmentEditModal: React.FC<EquipmentEditModalProps> = ({
  equipment,
  open,
  onOpenChange,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Equipment>>({});
  const [loading, setLoading] = useState(false);

  // Reset form when equipment changes
  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        manufacturer: equipment.manufacturer,
        status: equipment.status,
        location: equipment.location,
        description: equipment.description,
        category: equipment.category,
        price: equipment.price,
        lease_rate: equipment.lease_rate,
        image_url: equipment.image_url,
        model: equipment.model || '',
        serial_number: equipment.serial_number || '',
        condition: equipment.condition || '',
        specs: equipment.specs || '',
        quantity: equipment.quantity || 1,
        sales_option: equipment.sales_option || 'both',
        usage_hours: equipment.usage_hours || 0,
        downtime_hours: equipment.downtime_hours || 0,
        revenue_generated: equipment.revenue_generated || 0,
        remote_control_enabled: equipment.remote_control_enabled || false,
        payment_status: equipment.payment_status || 'compliant',
      });
    }
  }, [equipment]);

  const handleSave = async () => {
    if (!equipment) return;

    try {
      setLoading(true);
      await onSave(equipment.id, formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Equipment, value: string | number | boolean | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!equipment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#333333]">Edit Equipment</DialogTitle>
          <DialogDescription>
            Update equipment information for {equipment.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter equipment name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer || ''}
                  onChange={(e) => handleChange('manufacturer', e.target.value)}
                  placeholder="Enter manufacturer name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model || ''}
                  onChange={(e) => handleChange('model', e.target.value)}
                  placeholder="Enter model"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serial_number">Serial Number</Label>
                <Input
                  id="serial_number"
                  value={formData.serial_number || ''}
                  onChange={(e) => handleChange('serial_number', e.target.value)}
                  placeholder="Enter serial number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category || ''}
                  onValueChange={(value) => handleChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="imaging">Imaging Equipment</SelectItem>
                    <SelectItem value="monitoring">Patient Monitoring</SelectItem>
                    <SelectItem value="laboratory">Laboratory Equipment</SelectItem>
                    <SelectItem value="surgical">Surgical Equipment</SelectItem>
                    <SelectItem value="therapy">Therapy Equipment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={formData.condition || ''}
                  onValueChange={(value) => handleChange('condition', value)}
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
                  value={formData.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Enter location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || ''}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="In Use">In Use</SelectItem>
                    <SelectItem value="Leased">Leased</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Out of Service">Out of Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity || ''}
                  onChange={(e) => handleChange('quantity', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Enter quantity"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_status">Payment Status</Label>
                <Select
                  value={formData.payment_status || ''}
                  onValueChange={(value) => handleChange('payment_status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="price">Purchase Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => handleChange('price', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Enter purchase price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lease_rate">Lease Rate ($/month)</Label>
                <Input
                  id="lease_rate"
                  type="number"
                  step="0.01"
                  value={formData.lease_rate || ''}
                  onChange={(e) => handleChange('lease_rate', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Enter monthly lease rate"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sales_option">Sales Option</Label>
                <Select
                  value={formData.sales_option || ''}
                  onValueChange={(value) => handleChange('sales_option', value)}
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
                  value={formData.usage_hours || ''}
                  onChange={(e) => handleChange('usage_hours', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Enter usage hours"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="downtime_hours">Downtime Hours</Label>
                <Input
                  id="downtime_hours"
                  type="number"
                  min="0"
                  value={formData.downtime_hours || ''}
                  onChange={(e) => handleChange('downtime_hours', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Enter downtime hours"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenue_generated">Revenue Generated ($)</Label>
                <Input
                  id="revenue_generated"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.revenue_generated || ''}
                  onChange={(e) => handleChange('revenue_generated', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Enter revenue generated"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remote_control_enabled"
                  checked={formData.remote_control_enabled || false}
                  onChange={(e) => handleChange('remote_control_enabled', e.target.checked)}
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
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url || ''}
                  onChange={(e) => handleChange('image_url', e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specs">Specifications</Label>
                <Textarea
                  id="specs"
                  value={formData.specs || ''}
                  onChange={(e) => handleChange('specs', e.target.value)}
                  placeholder="Enter detailed specifications..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter equipment description..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !formData.name}
            className="bg-[#E02020] hover:bg-[#E02020]/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentEditModal;
