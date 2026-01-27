
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Wrench, ShoppingBag, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EquipmentHeader from './EquipmentHeader';
import EquipmentTable from './EquipmentTable';
import EquipmentCategories from './EquipmentCategories';
import ProductManagementSection from './ProductManagementSection';
import { useEquipmentManagement } from '@/hooks/useEquipmentManagement';
import AddEquipmentModal from './AddEquipmentModal';

const EquipmentManagement = () => {
  const [activeTab, setActiveTab] = useState('equipment');
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  
  const { equipment, loading, updateEquipment } = useEquipmentManagement();

  const filteredEquipment = useMemo(() => {
    if (visibilityFilter === 'all') return equipment;
    return equipment.filter(e => e.visibility_status === visibilityFilter);
  }, [equipment, visibilityFilter]);

  const handleAddEquipmentClick = () => {
    setShowAddEquipmentModal(true);
  };

  const handleEquipmentAdded = () => {
    setShowAddEquipmentModal(false);
    // Trigger refresh for categories by updating the key
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEquipmentUpdated = async (...args: Parameters<typeof updateEquipment>) => {
    const result = await updateEquipment(...args);
    // Trigger refresh for categories when equipment is updated
    setRefreshTrigger(prev => prev + 1);
    return result;
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

        <TabsContent value="equipment" className="mt-6 space-y-4">
          {/* Visibility Filter */}
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Visibility:</span>
            <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visibility</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
                <SelectItem value="visible_all">Visible to All</SelectItem>
                <SelectItem value="visible_hospitals">Hospitals Only</SelectItem>
                <SelectItem value="visible_investors">Investors Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <EquipmentTable 
            equipment={filteredEquipment}
            loading={loading}
            onUpdateEquipment={handleEquipmentUpdated}
          />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <ProductManagementSection />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <div key={refreshTrigger}>
            <EquipmentCategories />
          </div>
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
