
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  availableEquipment: number;
  activeBookings: number;
  pendingOrders: number;
  monthlySavings: number;
  utilizationRate: number;
}

export const useHospitalDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    availableEquipment: 0,
    activeBookings: 0,
    pendingOrders: 0,
    monthlySavings: 0,
    utilizationRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch available equipment count
      const { data: equipmentData } = await supabase
        .from('equipment')
        .select('id')
        .eq('status', 'Available');

      // Fetch active bookings count
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_id', user.id)
        .in('status', ['confirmed', 'in_progress']);

      // Fetch pending orders count
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'pending');

      // Calculate monthly savings (mock calculation based on bookings)
      const { data: monthlyBookings } = await supabase
        .from('bookings')
        .select('price_paid')
        .eq('user_id', user.id)
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      const monthlySavings = monthlyBookings?.reduce((sum, booking) => sum + Number(booking.price_paid || 0), 0) || 0;

      // Calculate utilization rate (mock calculation)
      const utilizationRate = bookingsData?.length ? Math.min(87 + (bookingsData.length * 2), 100) : 72;

      setStats({
        availableEquipment: equipmentData?.length || 0,
        activeBookings: bookingsData?.length || 0,
        pendingOrders: ordersData?.length || 0,
        monthlySavings: monthlySavings * 0.2, // Assuming 20% savings
        utilizationRate,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();

    // Set up real-time subscriptions
    const equipmentChannel = supabase
      .channel('equipment-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment' }, fetchDashboardStats)
      .subscribe();

    const bookingsChannel = supabase
      .channel('bookings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `user_id=eq.${user?.id}` }, fetchDashboardStats)
      .subscribe();

    const ordersChannel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user?.id}` }, fetchDashboardStats)
      .subscribe();

    return () => {
      supabase.removeChannel(equipmentChannel);
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [user]);

  return { stats, loading, refetch: fetchDashboardStats };
};
