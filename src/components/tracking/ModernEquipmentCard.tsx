
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      className={`cursor-pointer transition-all duration-300 ease-out hover:shadow-elegant hover:scale-[1.02] hover:-translate-y-1 ${
        isSelected 
          ? 'ring-2 ring-primary border-primary shadow-elegant bg-primary/5' 
          : 'border-border hover:border-primary/30 hover:bg-accent/30'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex gap-4 w-full">
          <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border border-border">
            {image_url ? (
              <img src={image_url} alt={name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Activity className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-foreground text-base leading-tight">{name}</h3>
                <Badge className={`${getStatusColor(status)} text-xs font-semibold px-2 py-1 whitespace-nowrap`}>
                  {status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{category}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
              
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{usage_hours}h used</span>
                </div>
                
                {remote_control_enabled && (
                  <div className="flex items-center gap-1 text-primary">
                    <Zap className="h-4 w-4" />
                    <span className="font-semibold text-sm">Remote</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="font-bold text-sm text-foreground">{uptime.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-500 ease-out" 
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
