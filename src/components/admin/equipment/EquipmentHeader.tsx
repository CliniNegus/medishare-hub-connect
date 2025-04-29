
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EquipmentHeaderProps {
  onAddEquipmentClick: () => void;
}

const EquipmentHeader = ({ onAddEquipmentClick }: EquipmentHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold">Equipment Management</h2>
      <Button 
        onClick={onAddEquipmentClick}
        className="bg-[#E02020] hover:bg-[#E02020]/90 text-white"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add New Equipment
      </Button>
    </div>
  );
};

export default EquipmentHeader;
