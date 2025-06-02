
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AnalyticsData {
  totalEquipment: number;
  activeLeases: number;
  maintenanceItems: number;
  revenue: number;
  utilizationRate: number;
  equipmentByCategory: Array<{
    category: string;
    count: number;
    usage: number;
  }>;
  equipmentDistribution: Array<{
    location: string;
    count: number;
  }>;
  syncStatus: Array<{
    system: string;
    status: 'synced' | 'syncing' | 'error';
    lastSync: string;
  }>;
}

export const useHospitalAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalEquipment: 0,
    activeLeases: 0,
    maintenanceItems: 0,
    revenue: 0,
    utilizationRate: 0,
    equipmentByCategory: [],
    equipmentDistribution: [],
    syncStatus: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch equipment data
      const { data: equipment, error: equipmentError } = await supabase
        .from('equipment')
        .select('*');

      if (equipmentError) throw equipmentError;

      // Fetch bookings data
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*, equipment(*)');

      if (bookingsError) throw bookingsError;

      // Fetch leases data
      const { data: leases, error: leasesError } = await supabase
        .from('leases')
        .select('*')
        .eq('status', 'active');

      if (leasesError) throw leasesError;

      // Fetch maintenance data
      const { data: maintenance, error: maintenanceError } = await supabase
        .from('maintenance')
        .select('*')
        .neq('status', 'completed');

      if (maintenanceError) throw maintenanceError;

      // Calculate analytics
      const totalEquipment = equipment?.length || 0;
      const activeLeases = leases?.length || 0;
      const maintenanceItems = maintenance?.length || 0;
      
      // Calculate revenue from bookings
      const revenue = bookings?.reduce((sum, booking) => 
        sum + (booking.price_paid || 0), 0) || 0;

      // Calculate utilization rate
      const totalBookingHours = bookings?.length || 0;
      const utilizationRate = totalEquipment > 0 ? (totalBookingHours / (totalEquipment * 24)) * 100 : 0;

      // Group equipment by category
      const categoryGroups = equipment?.reduce((acc, item) => {
        const category = item.category || 'Unknown';
        if (!acc[category]) {
          acc[category] = { count: 0, usage: 0 };
        }
        acc[category].count++;
        acc[category].usage += item.usage_hours || 0;
        return acc;
      }, {} as Record<string, { count: number; usage: number }>);

      const equipmentByCategory = Object.entries(categoryGroups || {}).map(([category, data]) => ({
        category,
        count: data.count,
        usage: data.usage
      }));

      // Group equipment by location
      const locationGroups = equipment?.reduce((acc, item) => {
        const location = item.location || 'Unknown';
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const equipmentDistribution = Object.entries(locationGroups || {}).map(([location, count]) => ({
        location,
        count
      }));

      // Mock sync status (in real app, this would come from actual sync monitoring)
      const syncStatus = [
        {
          system: 'Hospital Dashboards',
          status: 'synced' as const,
          lastSync: new Date(Date.now() - 2 * 60 * 1000).toISOString()
        },
        {
          system: 'Manufacturer Dashboards',
          status: 'synced' as const,
          lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        },
        {
          system: 'Inventory Management',
          status: Math.random() > 0.7 ? 'syncing' as const : 'synced' as const,
          lastSync: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        },
        {
          system: 'Admin Dashboard',
          status: 'synced' as const,
          lastSync: new Date(Date.now() - 1 * 60 * 1000).toISOString()
        }
      ];

      setAnalytics({
        totalEquipment,
        activeLeases,
        maintenanceItems,
        revenue,
        utilizationRate: Math.min(utilizationRate, 100),
        equipmentByCategory,
        equipmentDistribution,
        syncStatus
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    // Trigger a manual data refresh
    await fetchAnalytics();
  };

  const exportData = () => {
    // Create CSV export
    const csvData = [
      ['Metric', 'Value'],
      ['Total Equipment', analytics.totalEquipment.toString()],
      ['Active Leases', analytics.activeLeases.toString()],
      ['Maintenance Items', analytics.maintenanceItems.toString()],
      ['Revenue', `$${analytics.revenue.toLocaleString()}`],
      ['Utilization Rate', `${analytics.utilizationRate.toFixed(1)}%`],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hospital-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const forceSyncAll = async () => {
    // Force sync all systems
    setAnalytics(prev => ({
      ...prev,
      syncStatus: prev.syncStatus.map(status => ({
        ...status,
        status: 'syncing' as const
      }))
    }));

    // Simulate sync process
    setTimeout(async () => {
      await fetchAnalytics();
    }, 2000);
  };

  useEffect(() => {
    fetchAnalytics();

    // Set up real-time subscriptions
    const equipmentChannel = supabase
      .channel('equipment-analytics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipment'
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    const bookingsChannel = supabase
      .channel('bookings-analytics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    const leasesChannel = supabase
      .channel('leases-analytics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leases'
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(equipmentChannel);
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(leasesChannel);
    };
  }, [user]);

  return {
    analytics,
    loading,
    syncData,
    exportData,
    forceSyncAll
  };
};
