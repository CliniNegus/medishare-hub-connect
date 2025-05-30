
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminStats {
  hospitals: number;
  manufacturers: number;
  investors: number;
  equipmentItems: number;
  activeLeases: number;
  pendingOrders: number;
  maintenanceAlerts: number;
  totalRevenue: number;
}

interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  status: string;
  location: string;
}

interface MaintenanceItem {
  id: string;
  equipment: string;
  location: string;
  date: string;
  type: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
}

export const useAdminDashboardData = () => {
  const [stats, setStats] = useState<AdminStats>({
    hospitals: 0,
    manufacturers: 0,
    investors: 0,
    equipmentItems: 0,
    activeLeases: 0,
    pendingOrders: 0,
    maintenanceAlerts: 0,
    totalRevenue: 0
  });
  
  const [recentEquipment, setRecentEquipment] = useState<Equipment[]>([]);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState<MaintenanceItem[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      // Count hospitals
      const { count: hospitalCount } = await supabase
        .from('hospitals')
        .select('*', { count: 'exact', head: true });

      // Count users by role
      const { data: profiles } = await supabase
        .from('profiles')
        .select('role');

      const manufacturers = profiles?.filter(p => p.role === 'manufacturer').length || 0;
      const investors = profiles?.filter(p => p.role === 'investor').length || 0;

      // Count equipment
      const { count: equipmentCount } = await supabase
        .from('equipment')
        .select('*', { count: 'exact', head: true });

      // Count active leases
      const { count: activeLeaseCount } = await supabase
        .from('leases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Count pending orders
      const { count: pendingOrderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Count maintenance alerts
      const { count: maintenanceAlertCount } = await supabase
        .from('maintenance_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Calculate total revenue from active leases
      const { data: leases } = await supabase
        .from('leases')
        .select('monthly_payment')
        .eq('status', 'active');

      const totalRevenue = leases?.reduce((sum, lease) => sum + (lease.monthly_payment || 0), 0) || 0;

      setStats({
        hospitals: hospitalCount || 0,
        manufacturers,
        investors,
        equipmentItems: equipmentCount || 0,
        activeLeases: activeLeaseCount || 0,
        pendingOrders: pendingOrderCount || 0,
        maintenanceAlerts: maintenanceAlertCount || 0,
        totalRevenue: totalRevenue * 12 // Annualized
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
      });
    }
  };

  const fetchRecentEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('id, name, manufacturer, status, location')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const formattedEquipment = data?.map(item => ({
        id: item.id,
        name: item.name || 'Unnamed Equipment',
        manufacturer: item.manufacturer || 'Unknown Manufacturer',
        status: item.status || 'Available',
        location: item.location || 'Warehouse'
      })) || [];

      setRecentEquipment(formattedEquipment);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const fetchMaintenanceSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance')
        .select(`
          id,
          description,
          scheduled_date,
          status,
          equipment!inner(name, location)
        `)
        .order('scheduled_date', { ascending: true })
        .limit(5);

      if (error) throw error;

      const formattedMaintenance = data?.map(item => ({
        id: item.id,
        equipment: (item.equipment as any)?.name || 'Unknown Equipment',
        location: (item.equipment as any)?.location || 'Unknown Location',
        date: item.scheduled_date || new Date().toISOString(),
        type: item.description || 'Maintenance'
      })) || [];

      setMaintenanceSchedule(formattedMaintenance);
    } catch (error) {
      console.error('Error fetching maintenance:', error);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('id, created_at, amount, status, equipment!inner(name)')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;

      const formattedTransactions = orders?.map(order => ({
        id: order.id,
        date: order.created_at,
        description: `Equipment Order - ${(order.equipment as any)?.name || 'Unknown'}`,
        amount: order.amount || 0,
        type: 'Income'
      })) || [];

      setRecentTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchRecentEquipment(),
      fetchMaintenanceSchedule(),
      fetchRecentTransactions()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();

    // Set up real-time subscriptions
    const equipmentChannel = supabase
      .channel('equipment-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment' }, () => {
        fetchRecentEquipment();
        fetchStats();
      })
      .subscribe();

    const ordersChannel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchRecentTransactions();
        fetchStats();
      })
      .subscribe();

    const leasesChannel = supabase
      .channel('leases-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leases' }, () => {
        fetchStats();
      })
      .subscribe();

    const maintenanceChannel = supabase
      .channel('maintenance-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance' }, () => {
        fetchMaintenanceSchedule();
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(equipmentChannel);
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(leasesChannel);
      supabase.removeChannel(maintenanceChannel);
    };
  }, []);

  return {
    stats,
    recentEquipment,
    maintenanceSchedule,
    recentTransactions,
    loading,
    refreshData: fetchAllData
  };
};
