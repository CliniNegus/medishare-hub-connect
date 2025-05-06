
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface EquipmentHeaderProps {
  onAddEquipmentClick?: () => void;
}

const EquipmentHeader = ({ onAddEquipmentClick }: EquipmentHeaderProps) => {
  const navigate = useNavigate();
  
  const handleAddClick = () => {
    console.log("Add Equipment button clicked in header");
    if (onAddEquipmentClick) {
      onAddEquipmentClick();
    } else {
      console.log("Navigating to /add-equipment from header");
      navigate('/add-equipment');
    }
  };
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold">Equipment Management</h2>
      <Button 
        onClick={handleAddClick}
        className="bg-[#E02020] hover:bg-[#E02020]/90 text-white font-bold px-5 py-2"
        size="lg"
        variant="primary-red"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Add New Equipment
      </Button>
    </div>
  );
};

export default EquipmentHeader;
