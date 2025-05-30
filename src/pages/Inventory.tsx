
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package, Plus, Factory } from "lucide-react";
import Header from '@/components/Header';
import InventoryTable from '@/components/inventory/InventoryTable';
import InventoryStats from '@/components/inventory/InventoryStats';
import ManufacturersTable from '@/components/inventory/ManufacturersTable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { InventoryItem, Manufacturer } from '@/models/inventory';

const Inventory = () => {
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [manufacturerData, setManufacturerData] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch inventory data from Supabase
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch equipment data
        const { data: equipmentData, error: equipmentError } = await supabase
          .from('equipment')
          .select('*')
          .order('created_at', { ascending: false });

        if (equipmentError) throw equipmentError;

        // Transform equipment data to match InventoryItem interface
        const transformedInventory: InventoryItem[] = (equipmentData || []).map(item => ({
          id: item.id,
          name: item.name || 'Unnamed Equipment',
          sku: item.serial_number || `SKU-${item.id.substring(0, 8)}`,
          category: (item.category as any) || 'diagnostic',
          manufacturer: item.manufacturer || 'Unknown Manufacturer',
          currentStock: item.quantity || 1,
          availableForSharing: Math.max(0, (item.quantity || 1) - (item.usage_hours > 0 ? 1 : 0)),
          price: item.price || 0,
          leasingPrice: item.lease_rate || 0,
          image: item.image_url || '/placeholder-equipment.jpg',
          description: item.description || 'No description available',
          inUse: item.usage_hours > 0 ? 1 : 0,
          onMaintenance: 0, // This would need to be calculated from maintenance table
          location: item.location || 'Warehouse',
          cluster: 'Main Cluster', // Default cluster
          dateAdded: new Date(item.created_at).toLocaleDateString()
        }));

        setInventoryData(transformedInventory);

        // Create manufacturer data from unique manufacturers
        const uniqueManufacturers = [...new Set(transformedInventory.map(item => item.manufacturer))];
        const manufacturersList: Manufacturer[] = uniqueManufacturers.map((manufacturer, index) => ({
          id: `mfg-${index}`,
          name: manufacturer,
          logo: '/placeholder-logo.png',
          contactPerson: 'Contact Person',
          email: `contact@${manufacturer.toLowerCase().replace(/\s+/g, '')}.com`,
          phone: '+1-555-0123',
          itemsLeased: transformedInventory.filter(item => item.manufacturer === manufacturer && item.inUse > 0).length
        }));

        setManufacturerData(manufacturersList);

      } catch (error: any) {
        console.error('Error fetching inventory data:', error);
        toast({
          title: "Error loading inventory",
          description: error.message || "Failed to load inventory data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, [toast]);

  const handleViewInventoryItem = (id: string) => {
    setSelectedInventoryItem(id);
    const item = inventoryData.find(item => item.id === id);
    if (item) {
      toast({
        title: "Item Selected",
        description: `Viewing details for ${item.name}`,
      });
    }
  };

  const handleViewManufacturer = (id: string) => {
    setSelectedManufacturer(id);
    const manufacturer = manufacturerData.find(mfg => mfg.id === id);
    if (manufacturer) {
      toast({
        title: "Manufacturer Selected",
        description: `Viewing details for ${manufacturer.name}`,
      });
    }
  };

  const handleAddNewItem = () => {
    // Navigate to add equipment page or open modal
    toast({
      title: "Add New Item",
      description: "Opening add equipment form...",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#333333]">Inventory Management</h1>
            <Button 
              onClick={handleAddNewItem}
              className="bg-[#E02020] hover:bg-[#c01c1c] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </div>

          <InventoryStats items={inventoryData} />

          <div className="mt-8">
            <Tabs defaultValue="inventory">
              <TabsList className="mb-6">
                <TabsTrigger value="inventory" className="text-sm">
                  <Package className="h-4 w-4 mr-2" />
                  Inventory Items ({inventoryData.length})
                </TabsTrigger>
                <TabsTrigger value="manufacturers" className="text-sm">
                  <Factory className="h-4 w-4 mr-2" />
                  Manufacturers ({manufacturerData.length})
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
