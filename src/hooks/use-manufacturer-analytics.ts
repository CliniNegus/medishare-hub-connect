import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { subDays, format, startOfDay, endOfDay } from 'date-fns';

export interface AnalyticsMetrics {
  totalProducts: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStockItems: number;
}

export interface SalesTrend {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  product_id: string;
}

export interface OrderStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface StockLevel {
  name: string;
  stock: number;
  product_id: string;
}

export interface RecentOrder {
  id: string;
  product_name: string;
  quantity: number;
  status: string;
  amount: number;
  date: string;
  customer_name: string | null;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export const useManufacturerAnalytics = (
  dateRange: DateRange,
  productFilter?: string,
  statusFilter?: string
) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalProducts: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    lowStockItems: 0,
  });
  const [salesTrends, setSalesTrends] = useState<SalesTrend[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([]);
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      // Fetch manufacturer's equipment/products
      let equipmentQuery = supabase
        .from('equipment')
        .select('id, name, price, quantity, status, revenue_generated')
        .eq('owner_id', user.id);

      if (productFilter && productFilter !== 'all') {
        equipmentQuery = equipmentQuery.eq('id', productFilter);
      }

      const { data: equipment, error: equipmentError } = await equipmentQuery;
      if (equipmentError) throw equipmentError;

      const equipmentIds = equipment?.map(e => e.id) || [];

      // Fetch orders for manufacturer's equipment
      let ordersQuery = supabase
        .from('orders')
        .select('*, equipment:equipment_id(name)')
        .in('equipment_id', equipmentIds)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        ordersQuery = ordersQuery.eq('status', statusFilter);
      }

      const { data: orders, error: ordersError } = await ordersQuery;
      if (ordersError) throw ordersError;

      // Calculate metrics
      const totalProducts = equipment?.length || 0;
      const totalOrders = orders?.length || 0;
      const completedOrders = orders?.filter(o => o.status === 'delivered' || o.status === 'completed')?.length || 0;
      const pendingOrders = orders?.filter(o => o.status === 'pending' || o.status === 'processing')?.length || 0;
      const totalRevenue = orders
        ?.filter(o => o.status === 'delivered' || o.status === 'completed')
        ?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
      const lowStockItems = equipment?.filter(e => (e.quantity || 0) < 20)?.length || 0;

      setMetrics({
        totalProducts,
        totalOrders,
        completedOrders,
        pendingOrders,
        totalRevenue,
        lowStockItems,
      });

      // Calculate sales trends (group by date)
      const trendsMap = new Map<string, { revenue: number; orders: number }>();
      orders?.forEach(order => {
        if (order.status === 'delivered' || order.status === 'completed') {
          const dateKey = format(new Date(order.created_at), 'MMM dd');
          const existing = trendsMap.get(dateKey) || { revenue: 0, orders: 0 };
          trendsMap.set(dateKey, {
            revenue: existing.revenue + (order.amount || 0),
            orders: existing.orders + 1,
          });
        }
      });

      const trends = Array.from(trendsMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setSalesTrends(trends);

      // Calculate top products
      const productSalesMap = new Map<string, { name: string; sales: number; revenue: number; product_id: string }>();
      orders?.forEach(order => {
        if (order.status === 'delivered' || order.status === 'completed' && order.equipment) {
          const productId = order.equipment_id || '';
          const existing = productSalesMap.get(productId) || {
            name: (order.equipment as any)?.name || 'Unknown',
            sales: 0,
            revenue: 0,
            product_id: productId,
          };
          productSalesMap.set(productId, {
            ...existing,
            sales: existing.sales + 1,
            revenue: existing.revenue + (order.amount || 0),
          });
        }
      });

      const topProds = Array.from(productSalesMap.values())
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
      setTopProducts(topProds);

      // Calculate order status distribution
      const statusMap = new Map<string, number>();
      orders?.forEach(order => {
        const status = order.status || 'unknown';
        statusMap.set(status, (statusMap.get(status) || 0) + 1);
      });

      const statusData = Array.from(statusMap.entries()).map(([status, count]) => ({
        status,
        count,
        percentage: totalOrders > 0 ? (count / totalOrders) * 100 : 0,
      }));
      setOrderStatusData(statusData);

      // Get stock levels
      const stocks = equipment
        ?.map(e => ({
          name: e.name,
          stock: e.quantity || 0,
          product_id: e.id,
        }))
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 10) || [];
      setStockLevels(stocks);

      // Get recent orders
      const recent = orders
        ?.slice(0, 10)
        .map(order => ({
          id: order.id,
          product_name: (order.equipment as any)?.name || 'Unknown Product',
          quantity: 1,
          status: order.status,
          amount: order.amount,
          date: order.created_at,
          customer_name: order.shipping_full_name || null,
        })) || [];
      setRecentOrders(recent);

    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user, dateRange, productFilter, statusFilter]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const ordersChannel = supabase
      .channel('analytics-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          console.log('Orders changed, refreshing analytics...');
          fetchAnalytics();
        }
      )
      .subscribe();

    const equipmentChannel = supabase
      .channel('analytics-equipment-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipment',
          filter: `owner_id=eq.${user.id}`,
        },
        () => {
          console.log('Equipment changed, refreshing analytics...');
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(equipmentChannel);
    };
  }, [user, dateRange, productFilter, statusFilter]);

  return {
    metrics,
    salesTrends,
    topProducts,
    orderStatusData,
    stockLevels,
    recentOrders,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};
