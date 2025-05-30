
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  status: string;
  manufacturer?: string;
  category?: string;
  price?: number;
  lease_rate?: number;
  location?: string;
  shop_id?: string;
}

interface ClusterLocation {
  id: string;
  name: string;
  region: string;
  equipment_count: number;
  status: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  equipment_name?: string;
  hospital_name?: string;
}

interface ShopProduct {
  id: string;
  name: string;
  shop_name: string;
  stock: number;
  revenue: number;
  status: string;
}

export const useManufacturerManagementData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [clusterLocations, setClusterLocations] = useState<ClusterLocation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>([]);

  const fetchProducts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        variant: "destructive",
        title: "Error fetching products",
        description: error.message,
      });
    }
  };

  const fetchClusterLocations = async () => {
    try {
      const { data: clusters, error: clustersError } = await supabase
        .from('hospital_clusters')
        .select('*')
        .limit(5);

      if (clustersError) throw clustersError;

      const clustersWithEquipment = await Promise.all(
        (clusters || []).map(async (cluster) => {
          const { count } = await supabase
            .from('hospitals')
            .select('*', { count: 'exact', head: true })
            .eq('cluster_id', cluster.id);

          return {
            id: cluster.id,
            name: cluster.name,
            region: cluster.region,
            equipment_count: count || 0,
            status: 'active'
          };
        })
      );

      setClusterLocations(clustersWithEquipment);
    } catch (error: any) {
      console.error('Error fetching cluster locations:', error);
    }
  };

  const fetchPayments = async () => {
    if (!user) return;

    try {
      // First get leases with equipment info
      const { data: leases, error: leasesError } = await supabase
        .from('leases')
        .select(`
          *,
          equipment!inner(name, owner_id)
        `)
        .eq('equipment.owner_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);

      if (leasesError) throw leasesError;

      // Then get hospital names for each lease
      const paymentsData = await Promise.all(
        (leases || []).map(async (lease) => {
          let hospitalName = 'Unknown Hospital';
          
          if (lease.hospital_id) {
            const { data: hospital, error: hospitalError } = await supabase
              .from('hospitals')
              .select('name')
              .eq('id', lease.hospital_id)
              .single();
              
            if (!hospitalError && hospital) {
              hospitalName = hospital.name;
            }
          }

          return {
            id: lease.id,
            amount: lease.monthly_payment || 0,
            status: lease.status || 'pending',
            created_at: lease.created_at,
            equipment_name: lease.equipment?.name || 'Unknown Equipment',
            hospital_name: hospitalName
          };
        })
      );

      setPayments(paymentsData);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchShopProducts = async () => {
    if (!user) return;

    try {
      const { data: shops, error: shopsError } = await supabase
        .from('manufacturer_shops')
        .select('*')
        .eq('manufacturer_id', user.id);

      if (shopsError) throw shopsError;

      const shopProductsData = await Promise.all(
        (shops || []).map(async (shop) => {
          const { data: equipment, error: equipmentError } = await supabase
            .from('equipment')
            .select('*')
            .eq('shop_id', shop.id)
            .limit(5);

          if (equipmentError) throw equipmentError;

          return (equipment || []).map(item => ({
            id: item.id,
            name: item.name,
            shop_name: shop.name,
            stock: item.quantity || 1,
            revenue: item.revenue_generated || 0,
            status: item.status || 'Available'
          }));
        })
      );

      setShopProducts(shopProductsData.flat());
    } catch (error: any) {
      console.error('Error fetching shop products:', error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchProducts(),
      fetchClusterLocations(),
      fetchPayments(),
      fetchShopProducts()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const equipmentChannel = supabase
      .channel('equipment-management-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipment',
          filter: `owner_id=eq.${user.id}`
        },
        () => {
          console.log('Equipment data changed, refreshing...');
          fetchProducts();
          fetchShopProducts();
        }
      )
      .subscribe();

    const leasesChannel = supabase
      .channel('leases-management-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leases'
        },
        () => {
          console.log('Leases data changed, refreshing...');
          fetchPayments();
        }
      )
      .subscribe();

    const shopsChannel = supabase
      .channel('shops-management-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'manufacturer_shops',
          filter: `manufacturer_id=eq.${user.id}`
        },
        () => {
          console.log('Shops data changed, refreshing...');
          fetchShopProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(equipmentChannel);
      supabase.removeChannel(leasesChannel);
      supabase.removeChannel(shopsChannel);
    };
  }, [user]);

  return {
    products,
    clusterLocations,
    payments,
    shopProducts,
    loading,
    refetch: fetchAllData
  };
};
