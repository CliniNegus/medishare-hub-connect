
import React, { useState } from 'react';
import AddEquipmentModal from '@/components/equipment/AddEquipmentModal';
import EquipmentHeader from './EquipmentHeader';
import EquipmentCategories from './EquipmentCategories';
import EquipmentTable from './EquipmentTable';
import { useEquipmentManagement } from '@/hooks/useEquipmentManagement';
import { useToast } from '@/hooks/use-toast';
import { createEquipmentImagesBucket } from '@/integrations/supabase/createStorageBucket';

const EquipmentManagement = () => {
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
  const [bucketReady, setBucketReady] = useState(false);
  const { equipment, loading, updateEquipment, fetchEquipment } = useEquipmentManagement();
  const { toast } = useToast();

  const handleAddEquipmentClick = async () => {
    // Create bucket if needed before opening modal
    if (!bucketReady) {
      const result = await createEquipmentImagesBucket();
      setBucketReady(result);
      if (!result) {
        toast({
          title: "Storage Setup Error",
          description: "Failed to set up image storage. Some features may not work correctly.",
          variant: "destructive",
        });
        return;
      }
    }
    
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
