
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ManufacturerStats {
  totalEquipment: number;
  activeLease: number;
  maintenance: number;
  available: number;
  monthlyRevenue: number;
}

export const useManufacturerStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ManufacturerStats>({
    totalEquipment: 0,
    activeLease: 0,
    maintenance: 0,
    available: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      // Fetch all equipment owned by the manufacturer
      const { data: equipment, error: equipmentError } = await supabase
        .from('equipment')
        .select('*')
        .eq('owner_id', user.id);

      if (equipmentError) throw equipmentError;

      // Calculate equipment statistics
      const totalEquipment = equipment?.length || 0;
      const available = equipment?.filter(eq => eq.status === 'Available').length || 0;
      const maintenance = equipment?.filter(eq => eq.status === 'Maintenance').length || 0;

      // Fetch active leases for this manufacturer's equipment
      const { data: leases, error: leasesError } = await supabase
        .from('leases')
        .select('*, equipment!inner(*)')
        .eq('equipment.owner_id', user.id)
        .eq('status', 'active');

      if (leasesError) throw leasesError;

      const activeLease = leases?.length || 0;

      // Calculate monthly revenue from active leases
      const monthlyRevenue = leases?.reduce((total, lease) => {
        return total + (lease.monthly_payment || 0);
      }, 0) || 0;

      setStats({
        totalEquipment,
        activeLease,
        maintenance,
        available,
        monthlyRevenue
      });

    } catch (error: any) {
      console.error('Error fetching manufacturer stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const equipmentChannel = supabase
      .channel('equipment-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipment',
          filter: `owner_id=eq.${user.id}`
        },
        () => {
          console.log('Equipment data changed, refreshing stats...');
          fetchStats();
        }
      )
      .subscribe();

    const leasesChannel = supabase
      .channel('leases-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leases'
        },
        () => {
          console.log('Leases data changed, refreshing stats...');
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(equipmentChannel);
      supabase.removeChannel(leasesChannel);
    };
  }, [user]);

  return { stats, loading, error, refetch: fetchStats };
};
