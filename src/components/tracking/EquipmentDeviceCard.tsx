import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";

interface TrackingEquipment {
  id: string;
  name: string;
  category: string;
  status: string;
  location: string;
  image_url?: string;
  usage_hours: number;
  downtime_hours: number;
  remote_control_enabled: boolean;
  updated_at: string;
}

interface EquipmentDeviceCardProps {
  equipment: TrackingEquipment;
  isSelected: boolean;
  onClick: () => void;
}

const EquipmentDeviceCard: React.FC<EquipmentDeviceCardProps> = ({
  equipment,
  isSelected,
  onClick,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
      case 'online':
        return 'bg-green-500';
      case 'in use':
      case 'busy':
        return 'bg-yellow-500';
      case 'maintenance':
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
      case 'online':
        return 'default';
      case 'in use':
      case 'busy':
        return 'secondary';
      case 'maintenance':
      case 'offline':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const isOnline = equipment.status.toLowerCase() === 'available' || equipment.status.toLowerCase() === 'online';

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'ring-2 ring-primary border-primary bg-primary/5' 
          : 'hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Equipment Image */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden">
            {equipment.image_url ? (
              <img 
                src={equipment.image_url} 
                alt={equipment.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Clock className="h-6 w-6" />
              </div>
            )}
          </div>
          {/* Live indicator */}
          {isOnline && (
            <div className="absolute -top-1 -right-1 flex items-center gap-1">
              <div className={`h-3 w-3 rounded-full ${getStatusColor(equipment.status)} animate-pulse`} />
            </div>
          )}
        </div>

        {/* Equipment Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <h3 className="font-semibold text-sm truncate text-foreground">
              {equipment.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {equipment.category}
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{equipment.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant={getStatusVariant(equipment.status)} className="text-xs">
              {equipment.status}
            </Badge>
            {isOnline && (
              <span className="text-xs text-green-600 font-medium">Live</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EquipmentDeviceCard;