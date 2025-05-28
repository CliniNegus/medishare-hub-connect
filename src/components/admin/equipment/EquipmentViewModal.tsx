
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Equipment } from '@/hooks/useEquipmentManagement';
import { MapPin, DollarSign, Calendar, Package } from 'lucide-react';

interface EquipmentViewModalProps {
  equipment: Equipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EquipmentViewModal: React.FC<EquipmentViewModalProps> = ({
  equipment,
  open,
  onOpenChange
}) => {
  if (!equipment) return null;

  const getStatusBadgeColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-500 text-white';
      case 'in-use':
        return 'bg-blue-500 text-white';
      case 'maintenance':
        return 'bg-yellow-500 text-white';
      case 'leased':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#333333] flex items-center gap-2">
            <Package className="h-5 w-5" />
            Equipment Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about {equipment.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Equipment Image */}
          {equipment.image_url && (
            <div className="flex justify-center">
              <img 
                src={equipment.image_url} 
                alt={equipment.name}
                className="max-w-full h-48 object-cover rounded-lg border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          )}

          {/* Basic Information */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-[#333333]">
                {equipment.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">ID:</span>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {equipment.id}
                </span>
              </div>
            </div>
            <Badge className={getStatusBadgeColor(equipment.status)}>
              {equipment.status || 'Unknown'}
            </Badge>
          </div>

          <Separator />

          {/* Equipment Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-[#333333]">Equipment Information</h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Manufacturer:</span>
                  <span className="text-sm">{equipment.manufacturer || 'Not specified'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm">{equipment.location || 'Not specified'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Category:</span>
                  <span className="text-sm">{equipment.category || 'Not specified'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-[#333333]">Financial Information</h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-sm">{formatCurrency(equipment.price)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Lease Rate:</span>
                  <span className="text-sm">{formatCurrency(equipment.lease_rate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {equipment.description && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-[#333333] mb-2">Description</h4>
                <p className="text-sm text-gray-600">{equipment.description}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Timestamps */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-[#333333] mb-2">Record Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Created:</span>
                </div>
                <span className="text-gray-800">{formatDate(equipment.created_at)}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Last Updated:</span>
                </div>
                <span className="text-gray-800">{formatDate(equipment.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentViewModal;
