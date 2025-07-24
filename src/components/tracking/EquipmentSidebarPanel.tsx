import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EquipmentDeviceCard from "./EquipmentDeviceCard";

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

interface EquipmentSidebarPanelProps {
  equipmentList: TrackingEquipment[];
  selectedEquipmentId: string;
  onSelectEquipment: (id: string) => void;
}

const EquipmentSidebarPanel: React.FC<EquipmentSidebarPanelProps> = ({
  equipmentList,
  selectedEquipmentId,
  onSelectEquipment,
}) => {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Your Equipment</CardTitle>
        <p className="text-sm text-muted-foreground">
          {equipmentList.length} device{equipmentList.length !== 1 ? 's' : ''} connected
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-3">
          {equipmentList.map(equipment => (
            <EquipmentDeviceCard
              key={equipment.id}
              equipment={equipment}
              isSelected={selectedEquipmentId === equipment.id}
              onClick={() => onSelectEquipment(equipment.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentSidebarPanel;