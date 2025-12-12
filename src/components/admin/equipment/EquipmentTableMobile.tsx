import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Equipment } from '@/hooks/useEquipmentManagement';
import { useAuth } from '@/contexts/AuthContext';

interface EquipmentTableMobileProps {
  equipment: Equipment[];
  onViewEquipment: (item: Equipment) => void;
  onEditEquipment: (item: Equipment) => void;
}

const EquipmentTableMobile = ({ 
  equipment, 
  onViewEquipment, 
  onEditEquipment 
}: EquipmentTableMobileProps) => {
  const { user, userRoles } = useAuth();

  // Check if user can edit equipment (admin or owner)
  const canEditEquipment = (item: Equipment) => {
    return userRoles.isAdmin || item.owner_id === user?.id;
  };

  const getStatusBadgeColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in-use':
        return 'bg-blue-100 text-blue-800';
      case 'leased':
        return 'bg-purple-100 text-purple-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'out of service':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateId = (id: string) => {
    return id.length > 8 ? `${id.substring(0, 8)}...` : id;
  };

  return (
    <div className="space-y-4">
      {equipment.map((item) => (
        <div key={item.id} className="card-stack">
          {/* Header with equipment name and status */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                ID: <span className="font-mono bg-gray-100 px-1 rounded text-xs">
                  {truncateId(item.id)}
                </span>
              </p>
            </div>
            <Badge className={getStatusBadgeColor(item.status)}>
              {item.status || 'Unknown'}
            </Badge>
          </div>

          {/* Equipment details */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Manufacturer:</span>
              <span className="font-medium">{item.manufacturer || 'Unknown'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{item.location || 'Not specified'}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            {canEditEquipment(item) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-[#E02020] text-[#E02020] hover:bg-red-50"
                onClick={() => onEditEquipment(item)}
              >
                Edit
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-gray-300 hover:bg-gray-50"
              onClick={() => onViewEquipment(item)}
            >
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EquipmentTableMobile;