
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EquipmentDetails, statusColors } from '@/types/equipment';

interface EquipmentHeaderProps {
  equipment: EquipmentDetails | null;
  onBack: () => void;
}

const EquipmentHeader = ({ equipment, onBack }: EquipmentHeaderProps) => {
  const status = equipment?.status || 'Available';
  
  return (
    <>
      <Button variant="ghost" className="mb-6" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-600">{equipment?.name}</h2>
        <Badge className={`${statusColors[status]}`}>
          {status}
        </Badge>
      </div>
    </>
  );
};

export default EquipmentHeader;
