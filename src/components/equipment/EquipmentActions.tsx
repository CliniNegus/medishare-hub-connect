
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddEquipmentModal from "./AddEquipmentModal";

interface EquipmentActionsProps {
  onEquipmentAdded?: () => void;
}

const EquipmentActions: React.FC<EquipmentActionsProps> = ({ onEquipmentAdded }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div>
      <Button 
        onClick={() => setIsAddModalOpen(true)}
        className="bg-[#E02020] hover:bg-[#E02020]/90 text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Equipment
      </Button>
      
      <AddEquipmentModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onEquipmentAdded={onEquipmentAdded}
      />
    </div>
  );
};

export default EquipmentActions;
