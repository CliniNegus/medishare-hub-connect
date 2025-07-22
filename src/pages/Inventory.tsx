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

  // Fetch hospital-specific inventory data from Supabase
  useEffect(() => {
    const fetchHospitalInventoryData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch equipment from orders (purchased equipment)
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            equipment:equipment_id (*)
          `)
          .eq('user_id', user.id)
          .eq('status', 'completed');

        // Fetch equipment from leases (leased equipment)
        const { data: leasesData, error: leasesError } = await supabase
          .from('leases')
          .select(`
            *,
            equipment:equipment_id (*)
          `)
          .eq('hospital_id', user.id)
          .in('status', ['active', 'pending']);

        // Fetch equipment from bookings (booked equipment)
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            equipment:equipment_id (*)
          `)
          .eq('user_id', user.id)
          .in('status', ['confirmed', 'active']);

        if (ordersError) throw ordersError;
        if (leasesError) throw leasesError;
        if (bookingsError) throw bookingsError;

        const transformedInventory: InventoryItem[] = [];
        
        // Process purchased equipment
        (ordersData || []).forEach(order => {
          if (order.equipment) {
            transformedInventory.push({
              id: order.equipment.id,
              name: order.equipment.name || 'Unnamed Equipment',
              sku: order.equipment.serial_number || `SKU-${order.equipment.id.substring(0, 8)}`,
              category: (order.equipment.category as any) || 'diagnostic',
              manufacturer: order.equipment.manufacturer || 'Unknown Manufacturer',
              currentStock: 1, // Hospital owns it
              availableForSharing: 1, // Available for use
              price: order.amount || order.equipment.price || 0,
              leasingPrice: 0,
              image: order.equipment.image_url || '/placeholder-equipment.jpg',
              description: order.equipment.description || 'No description available',
              inUse: 0,
              onMaintenance: 0,
              location: 'Your Hospital',
              cluster: 'Purchased',
              dateAdded: new Date(order.created_at).toLocaleDateString()
            });
          }
        });

        // Process leased equipment
        (leasesData || []).forEach(lease => {
          if (lease.equipment) {
            transformedInventory.push({
              id: lease.equipment.id,
              name: lease.equipment.name || 'Unnamed Equipment',
              sku: lease.equipment.serial_number || `SKU-${lease.equipment.id.substring(0, 8)}`,
              category: (lease.equipment.category as any) || 'diagnostic',
              manufacturer: lease.equipment.manufacturer || 'Unknown Manufacturer',
              currentStock: 1, // Hospital is leasing it
              availableForSharing: 1, // Available for use
              price: lease.monthly_payment || 0,
              leasingPrice: lease.monthly_payment || 0,
              image: lease.equipment.image_url || '/placeholder-equipment.jpg',
              description: lease.equipment.description || 'No description available',
              inUse: lease.status === 'active' ? 1 : 0,
              onMaintenance: 0,
              location: 'Your Hospital',
              cluster: 'Leased',
              dateAdded: new Date(lease.created_at).toLocaleDateString()
            });
          }
        });

        // Process booked equipment
        (bookingsData || []).forEach(booking => {
          if (booking.equipment) {
            transformedInventory.push({
              id: booking.equipment.id,
              name: booking.equipment.name || 'Unnamed Equipment',
              sku: booking.equipment.serial_number || `SKU-${booking.equipment.id.substring(0, 8)}`,
              category: (booking.equipment.category as any) || 'diagnostic',
              manufacturer: booking.equipment.manufacturer || 'Unknown Manufacturer',
              currentStock: 1, // Hospital has booked it
              availableForSharing: booking.status === 'confirmed' ? 1 : 0,
              price: booking.price_paid || 0,
              leasingPrice: 0,
              image: booking.equipment.image_url || '/placeholder-equipment.jpg',
              description: booking.equipment.description || 'No description available',
              inUse: booking.status === 'active' ? 1 : 0,
              onMaintenance: 0,
              location: 'Your Hospital',
              cluster: 'Booked',
              dateAdded: new Date(booking.created_at).toLocaleDateString()
            });
          }
        });

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

    fetchHospitalInventoryData();
  }, [user, toast]);

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

  const handleViewMarketplace = () => {
    // Navigate to equipment marketplace
    toast({
      title: "Browse Equipment",
      description: "Opening equipment marketplace...",
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
            <h1 className="text-3xl font-bold text-[#333333]">Your Equipment</h1>
            <Button 
              onClick={handleViewMarketplace}
              className="bg-[#E02020] hover:bg-[#c01c1c] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Browse Equipment
            </Button>
          </div>

          <InventoryStats items={inventoryData} />

          <div className="mt-8">
            <Tabs defaultValue="inventory">
              <TabsList className="mb-6">
                <TabsTrigger value="inventory" className="text-sm">
                  <Package className="h-4 w-4 mr-2" />
                  Your Equipment ({inventoryData.length})
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
