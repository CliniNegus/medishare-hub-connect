
import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface Equipment {
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

interface EquipmentDetailsHeaderProps {
  equipment: Equipment;
}

const EquipmentDetailsHeader: React.FC<EquipmentDetailsHeaderProps> = ({ equipment }) => {
  return (
    <Card className="border-t-4 border-t-[#E02020]">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            <CardTitle className="text-lg sm:text-xl font-bold text-[#333333] truncate">
              {equipment.name}
            </CardTitle>
            <p className="text-sm sm:text-base text-gray-600 truncate">
              {equipment.category} • {equipment.location}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 text-green-600">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium">Live</span>
            </div>
            {equipment.remote_control_enabled && (
              <Button size="sm" className="bg-[#E02020] hover:bg-[#c01c1c] text-white text-xs sm:text-sm">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden xs:inline">Remote Control</span>
                <span className="xs:hidden">Remote</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default EquipmentDetailsHeader;
