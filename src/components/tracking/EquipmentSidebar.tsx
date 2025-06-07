
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ModernEquipmentCard from "./ModernEquipmentCard";

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

interface EquipmentSidebarProps {
  equipmentList: Equipment[];
  selectedEquipmentId: string;
  onSelectEquipment: (id: string) => void;
}

const EquipmentSidebar: React.FC<EquipmentSidebarProps> = ({
  equipmentList,
  selectedEquipmentId,
  onSelectEquipment,
}) => {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg font-semibold text-[#333333]">Your Equipment</CardTitle>
        <p className="text-xs sm:text-sm text-gray-600">{equipmentList.length} devices connected</p>
      </CardHeader>
      <CardContent className="pt-0 px-4 sm:px-6">
        <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto pr-1 sm:pr-2">
          {equipmentList.map(equipment => (
            <ModernEquipmentCard
              key={equipment.id}
              {...equipment}
              isSelected={selectedEquipmentId === equipment.id}
              onClick={() => onSelectEquipment(equipment.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentSidebar;
