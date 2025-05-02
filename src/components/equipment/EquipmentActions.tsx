
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface EquipmentActionsProps {
  onEquipmentAdded?: () => void;
}

const EquipmentActions: React.FC<EquipmentActionsProps> = ({ onEquipmentAdded }) => {
  const navigate = useNavigate();

  const handleAddEquipmentClick = () => {
    navigate('/add-equipment');
  };

  return (
    <div>
      <Button 
        onClick={handleAddEquipmentClick}
        className="bg-[#E02020] hover:bg-[#E02020]/90 text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Equipment
      </Button>
    </div>
  );
};

export default EquipmentActions;
