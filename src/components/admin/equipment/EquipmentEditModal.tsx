
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

  const handleChange = (field: keyof Equipment, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!equipment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#333333]">Edit Equipment</DialogTitle>
          <DialogDescription>
            Update equipment information for {equipment.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Equipment Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Equipment Name *</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter equipment name"
            />
          </div>

          {/* Manufacturer */}
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              value={formData.manufacturer || ''}
              onChange={(e) => handleChange('manufacturer', e.target.value)}
              placeholder="Enter manufacturer name"
            />
          </div>

          {/* Status */}
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in-use">In Use</SelectItem>
                <SelectItem value="leased">Leased</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="out of service">Out of Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Enter location"
            />
          </div>

          {/* Category */}
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

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => handleChange('price', e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="Enter price"
            />
          </div>

          {/* Lease Rate */}
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter equipment description"
              rows={3}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4">
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
