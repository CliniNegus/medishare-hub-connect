
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";

export interface VirtualShop {
  id: string;
  name: string;
  country: string;
  equipment_count: number;
  revenue_generated: number;
}

export const useManufacturerShops = () => {
  const [virtualShops, setVirtualShops] = useState<VirtualShop[]>([]);
  const [loadingShops, setLoadingShops] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchVirtualShops = async () => {
    if (!user) return;
    
    try {
      setLoadingShops(true);
      
      const { data: shopsData, error: shopsError } = await supabase
        .from('manufacturer_shops')
        .select('*')
        .eq('manufacturer_id', user.id)
        .limit(3);
      
      if (shopsError) throw shopsError;
      
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
            
            const revenueGenerated = revenueData?.reduce((sum, item) => {
              const revenue = item.revenue_generated ? String(item.revenue_generated) : '0';
              return sum + parseFloat(revenue);
            }, 0) || 0;
            
            return {
              id: shop.id,
              name: shop.name,
              country: shop.country,
              equipment_count: equipmentCount || 0,
              revenue_generated: revenueGenerated
            };
          })
        );
        
        setVirtualShops(shopsWithStats);
      }
    } catch (error: any) {
      console.error('Error fetching virtual shops:', error.message);
      toast({
        variant: "destructive",
        title: "Error fetching shops",
        description: error.message,
      });
    } finally {
      setLoadingShops(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchVirtualShops();
    }
  }, [user]);

  return {
    virtualShops,
    loadingShops,
    fetchVirtualShops
  };
};
