
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EquipmentHeaderProps {
  onAddEquipmentClick: () => void;
}

const EquipmentHeader = ({ onAddEquipmentClick }: EquipmentHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-[#333333]">Equipment Management</h2>
      <Button 
        onClick={onAddEquipmentClick}
        className="bg-[#E02020] hover:bg-[#E02020]/90 text-white font-bold px-5 py-2"
        size="lg"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Add New Equipment
      </Button>
    </div>
  );
};

export default EquipmentHeader;
