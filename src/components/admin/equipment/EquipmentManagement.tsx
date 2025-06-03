
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Wrench, ShoppingBag } from "lucide-react";
import EquipmentHeader from './EquipmentHeader';
import EquipmentTable from './EquipmentTable';
import EquipmentCategories from './EquipmentCategories';
import ProductManagementSection from './ProductManagementSection';

const EquipmentManagement = () => {
  const [activeTab, setActiveTab] = useState('equipment');

  return (
    <div className="space-y-6">
      <EquipmentHeader />
      
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
          <EquipmentTable />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <ProductManagementSection />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <EquipmentCategories />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentManagement;
