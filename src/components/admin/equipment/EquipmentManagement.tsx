
import React, { useState } from 'react';
import AddEquipmentModal from './AddEquipmentModal';
import EquipmentHeader from './EquipmentHeader';
import EquipmentCategories from './EquipmentCategories';
import EquipmentTable from './EquipmentTable';
import { useEquipmentManagement } from '@/hooks/useEquipmentManagement';
import { useToast } from '@/hooks/use-toast';

const EquipmentManagement = () => {
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
  const { equipment, loading, updateEquipment, fetchEquipment } = useEquipmentManagement();
  const { toast } = useToast();

  const handleAddEquipmentClick = () => {
    setIsAddEquipmentModalOpen(true);
  };

  const handleEquipmentAdded = () => {
    // Refresh the equipment list when new equipment is added
    fetchEquipment();
    toast({
      title: "Success",
      description: "Equipment added successfully", 
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <EquipmentHeader onAddEquipmentClick={handleAddEquipmentClick} />
      <EquipmentCategories />
      
      <h3 className="text-lg font-semibold mb-4">All Equipment</h3>
      <EquipmentTable 
        equipment={equipment} 
        loading={loading}
        onUpdateEquipment={updateEquipment}
      />

      {/* Equipment Modal */}
      <AddEquipmentModal
        open={isAddEquipmentModalOpen}
        onOpenChange={setIsAddEquipmentModalOpen}
        onEquipmentAdded={handleEquipmentAdded}
      />
    </div>
  );
};

export default EquipmentManagement;
