
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, MapPin, Clock, Zap } from "lucide-react";

interface ModernEquipmentCardProps {
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
  isSelected: boolean;
  onClick: () => void;
}

const ModernEquipmentCard: React.FC<ModernEquipmentCardProps> = ({
  name,
  category,
  status,
  location,
  image_url,
  usage_hours,
  downtime_hours,
  remote_control_enabled,
  updated_at,
  isSelected,
  onClick,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'in use':
      case 'leased':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'offline':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const uptime = usage_hours / (usage_hours + downtime_hours) * 100 || 0;

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-[#E02020] border-[#E02020] shadow-md' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-5">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
            {image_url ? (
              <img src={image_url} alt={name} className="w-full h-full object-cover" />
            ) : (
              <Activity className="h-8 w-8 text-gray-500" />
            )}
          </div>
          
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-[#333333] truncate text-lg">{name}</h3>
              <Badge className={`${getStatusColor(status)} text-sm font-medium ml-3 flex-shrink-0`}>
                {status}
              </Badge>
            </div>
            
            <p className="text-gray-600 font-medium">{category}</p>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{usage_hours}h used</span>
                </div>
                
                {remote_control_enabled && (
                  <div className="flex items-center text-[#E02020]">
                    <Zap className="h-4 w-4 mr-2" />
                    <span className="font-medium">Remote</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>Uptime</span>
                  <span className="font-medium">{uptime.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(uptime, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernEquipmentCard;
