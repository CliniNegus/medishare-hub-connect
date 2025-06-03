
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Wrench, ShoppingBag } from "lucide-react";
import EquipmentHeader from './EquipmentHeader';
import EquipmentTable from './EquipmentTable';
import EquipmentCategories from './EquipmentCategories';
import ProductManagementSection from './ProductManagementSection';
import { useEquipmentManagement } from '@/hooks/useEquipmentManagement';
import AddEquipmentModal from './AddEquipmentModal';

const EquipmentManagement = () => {
  const [activeTab, setActiveTab] = useState('equipment');
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  
  const { equipment, loading, updateEquipment } = useEquipmentManagement();

  const handleAddEquipmentClick = () => {
    setShowAddEquipmentModal(true);
  };

  const handleEquipmentAdded = () => {
    setShowAddEquipmentModal(false);
    // Refresh equipment list if needed
  };

  return (
    <div className="space-y-6">
      <EquipmentHeader onAddEquipmentClick={handleAddEquipmentClick} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="equipment" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#E02020]"
          >
            <Wrench className="h-4 w-4" />
            Equipment
          </TabsTrigger>
          <TabsTrigger 
            value="products" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#E02020]"
          >
            <ShoppingBag className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger 
            value="categories" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#E02020]"
          >
            <Package className="h-4 w-4" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="mt-6">
          <EquipmentTable 
            equipment={equipment}
            loading={loading}
            onUpdateEquipment={updateEquipment}
          />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <ProductManagementSection />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <EquipmentCategories />
        </TabsContent>
      </Tabs>

      {/* Add Equipment Modal */}
      <AddEquipmentModal
        open={showAddEquipmentModal}
        onOpenChange={setShowAddEquipmentModal}
        onEquipmentAdded={handleEquipmentAdded}
      />
    </div>
  );
};

export default EquipmentManagement;
