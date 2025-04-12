
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package, Plus, Factory } from "lucide-react";
import Header from '@/components/Header';
import InventoryTable from '@/components/inventory/InventoryTable';
import InventoryStats from '@/components/inventory/InventoryStats';
import ManufacturersTable from '@/components/inventory/ManufacturersTable';
import { inventoryData, manufacturerData } from '@/data/mockData';

const Inventory = () => {
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);

  const handleViewInventoryItem = (id: string) => {
    setSelectedInventoryItem(id);
    // In a real app, you would navigate to a details view or open a modal
    console.log(`View inventory item with ID: ${id}`);
  };

  const handleViewManufacturer = (id: string) => {
    setSelectedManufacturer(id);
    // In a real app, you would navigate to a details view or open a modal
    console.log(`View manufacturer with ID: ${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </div>

          <InventoryStats items={inventoryData} />

          <div className="mt-6">
            <Tabs defaultValue="inventory">
              <TabsList>
                <TabsTrigger value="inventory" className="text-sm">
                  <Package className="h-4 w-4 mr-2" />
                  Inventory Items
                </TabsTrigger>
                <TabsTrigger value="manufacturers" className="text-sm">
                  <Factory className="h-4 w-4 mr-2" />
                  Manufacturers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inventory" className="mt-4">
                <InventoryTable 
                  items={inventoryData} 
                  onViewItem={handleViewInventoryItem} 
                />
              </TabsContent>

              <TabsContent value="manufacturers" className="mt-4">
                <ManufacturersTable 
                  manufacturers={manufacturerData} 
                  onViewManufacturer={handleViewManufacturer} 
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inventory;
