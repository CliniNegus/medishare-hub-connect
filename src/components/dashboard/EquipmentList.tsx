
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import EquipmentCard, { EquipmentProps } from '../EquipmentCard';

interface EquipmentListProps {
  equipmentData: EquipmentProps[];
  onBookEquipment: (id: string) => void;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ equipmentData, onBookEquipment }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Available Equipment</h2>
        <Badge variant="outline" className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Updated 5m ago
        </Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipmentData.map(equipment => (
          <EquipmentCard 
            key={equipment.id} 
            {...equipment} 
            onBook={onBookEquipment}
          />
        ))}
      </div>
    </div>
  );
};

export default EquipmentList;
