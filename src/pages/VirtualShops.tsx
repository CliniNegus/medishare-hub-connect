
import React, { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useToast } from "@/components/ui/use-toast";
import { Shop } from '@/components/shops/types';
import ShopsList from '@/components/shops/ShopsList';
import CreateShopDialog from '@/components/shops/CreateShopDialog';

const VirtualShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newShop, setNewShop] = useState({
    name: '',
    country: '',
    description: ''
  });
  const countries = ["Kenya", "Rwanda", "Nigeria", "Ghana", "South Africa", "Uganda", "Tanzania", "Ethiopia", "Egypt"];

  const { user } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();

  useEffect(() => {
    fetchShops();
  }, [user]);

  const fetchShops = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get shops with equipment count
      const { data: shopsData, error: shopsError } = await supabase
        .from('manufacturer_shops')
        .select('*')
        .eq('manufacturer_id', user.id);

      if (shopsError) throw shopsError;

      // For each shop, count equipment and revenue
      if (shopsData) {
        const shopsWithStats = await Promise.all(
          shopsData.map(async (shop) => {
            const { count: equipmentCount } = await supabase
              .from('equipment')
              .select('*', { count: 'exact', head: true })
              .eq('shop_id', shop.id);

            const { data: revenueData } = await supabase
              .from('equipment')
              .select('revenue_generated')
              .eq('shop_id', shop.id);

            const revenueTotal = revenueData?.reduce((sum, item) => {
              const revenue = item.revenue_generated ? String(item.revenue_generated) : '0';
              return sum + parseFloat(revenue);
            }, 0) || 0;

            return {
              ...shop,
              equipment_count: equipmentCount || 0,
              revenue_total: revenueTotal
            };
          })
        );

        setShops(shopsWithStats);
      }
    } catch (error: any) {
      console.error('Error fetching shops:', error.message);
      toast({
        variant: "destructive",
        title: "Error fetching shops",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShopChange = (field: string, value: string) => {
    setNewShop(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateShop = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('manufacturer_shops')
        .insert({
          name: newShop.name,
          country: newShop.country,
          description: newShop.description,
          manufacturer_id: user.id
        })
        .select();

      if (error) throw error;
      
      toast({
        title: "Shop created",
        description: `${newShop.name} has been created successfully.`,
      });
      
      setIsCreateDialogOpen(false);
      setNewShop({ name: '', country: '', description: '' });
      fetchShops();
    } catch (error: any) {
      console.error('Error creating shop:', error.message);
      toast({
        variant: "destructive",
        title: "Error creating shop",
        description: error.message,
      });
    }
  };

  if (role !== 'manufacturer' && role !== 'admin') {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="text-center py-10">
                <Store className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Manufacturer Access Required</h2>
                <p className="mb-6">You need manufacturer access to view virtual shops.</p>
                <Button>Return to Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-red-600">Virtual Manufacturer Shops</h1>
            <p className="text-gray-600">Manage your virtual shops and equipment across different countries</p>
          </div>
          
          <CreateShopDialog
            isOpen={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            newShop={newShop}
            countries={countries}
            onShopChange={handleShopChange}
            onCreateShop={handleCreateShop}
          />
        </div>

        <ShopsList 
          shops={shops}
          loading={loading}
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          newShop={newShop}
          countries={countries}
          handleShopChange={handleShopChange}
          handleCreateShop={handleCreateShop}
          onRefresh={fetchShops}
        />
      </div>
    </Layout>
  );
};

export default VirtualShops;
