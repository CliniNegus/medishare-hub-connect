import React, { useState, useEffect } from 'react';
import { subDays } from 'date-fns';
import { useManufacturerAnalytics, type DateRange } from '@/hooks/use-manufacturer-analytics';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import AnalyticsMetricCards from '../analytics/AnalyticsMetricCards';
import AnalyticsFilters from '../analytics/AnalyticsFilters';
import SalesTrendsChart from '../analytics/SalesTrendsChart';
import TopProductsChart from '../analytics/TopProductsChart';
import OrderStatusChart from '../analytics/OrderStatusChart';
import StockLevelsChart from '../analytics/StockLevelsChart';
import RecentOrdersTable from '../analytics/RecentOrdersTable';
import LowStockTable from '../analytics/LowStockTable';
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const AnalyticsTab = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [productFilter, setProductFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [products, setProducts] = useState<Array<{ id: string; name: string }>>([]);

  const {
    metrics,
    salesTrends,
    topProducts,
    orderStatusData,
    stockLevels,
    recentOrders,
    loading,
    error,
    refetch,
  } = useManufacturerAnalytics(dateRange, productFilter, statusFilter);

  // Fetch products for filter dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('equipment')
        .select('id, name')
        .eq('owner_id', user.id)
        .order('name');
      
      if (!error && data) {
        setProducts(data);
      }
    };

    fetchProducts();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#333333]">Analytics Dashboard</h2>
          <p className="text-sm text-gray-600">Comprehensive insights into your business performance</p>
        </div>
        <Button 
          onClick={refetch} 
          variant="outline" 
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <AnalyticsFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        productFilter={productFilter}
        onProductFilterChange={setProductFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        products={products}
      />

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading analytics: {error}
        </div>
      )}

      {/* Metrics Cards */}
      <AnalyticsMetricCards metrics={metrics} loading={loading} />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesTrendsChart data={salesTrends} loading={loading} />
        <TopProductsChart data={topProducts} loading={loading} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart data={orderStatusData} loading={loading} />
        <StockLevelsChart data={stockLevels} loading={loading} />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={recentOrders} loading={loading} />
        </div>
        <div className="lg:col-span-1">
          <LowStockTable items={stockLevels} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
