
import React, { useState } from 'react';
import AddEquipmentModal from '@/components/equipment/AddEquipmentModal';
import EquipmentHeader from './EquipmentHeader';
import EquipmentCategories from './EquipmentCategories';
import EquipmentTable from './EquipmentTable';
import { useEquipment } from './useEquipment';
import { useToast } from '@/hooks/use-toast';

interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  status: string;
  location: string;
}

interface EquipmentManagementProps {
  recentEquipment: Equipment[];
}

const EquipmentManagement = ({ recentEquipment: initialEquipment }: EquipmentManagementProps) => {
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
  const { equipment, handleProductAdded, ensureBucketReady } = useEquipment(initialEquipment);
  const { toast } = useToast();

  const handleAddEquipmentClick = async () => {
    const bucketReady = await ensureBucketReady();
    if (!bucketReady) {
      toast({
        title: "Storage Setup Error",
        description: "Failed to set up image storage. Some features may not work correctly.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAddEquipmentModalOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <EquipmentHeader onAddEquipmentClick={handleAddEquipmentClick} />
      <EquipmentCategories />
      
      <h3 className="text-lg font-semibold mb-4">All Equipment</h3>
      <EquipmentTable equipment={equipment} />

      {/* Equipment Modal */}
      <AddEquipmentModal
        open={isAddEquipmentModalOpen}
        onOpenChange={setIsAddEquipmentModalOpen}
        onEquipmentAdded={handleProductAdded}
      />
    </div>
  );
};

export default EquipmentManagement;
