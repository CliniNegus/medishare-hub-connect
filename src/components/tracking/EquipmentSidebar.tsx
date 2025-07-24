
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
    <Card className="h-fit shadow-card">
      <CardHeader className="pb-4 px-6">
        <CardTitle className="text-lg font-bold text-foreground">Your Equipment</CardTitle>
        <p className="text-sm text-muted-foreground">{equipmentList.length} devices connected</p>
      </CardHeader>
      <CardContent className="pt-0 px-6 pb-6">
        <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
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
