import React, { useState, useEffect } from 'react';
import { subDays } from 'date-fns';
import { useManufacturerAnalytics, type DateRange } from '@/hooks/use-manufacturer-analytics';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AnalyticsMetricCards from '@/components/manufacturer-dashboard/analytics/AnalyticsMetricCards';
import AnalyticsFilters from '@/components/manufacturer-dashboard/analytics/AnalyticsFilters';
import SalesTrendsChart from '@/components/manufacturer-dashboard/analytics/SalesTrendsChart';
import TopProductsChart from '@/components/manufacturer-dashboard/analytics/TopProductsChart';
import OrderStatusChart from '@/components/manufacturer-dashboard/analytics/OrderStatusChart';
import StockLevelsChart from '@/components/manufacturer-dashboard/analytics/StockLevelsChart';
import RecentOrdersTable from '@/components/manufacturer-dashboard/analytics/RecentOrdersTable';
import LowStockTable from '@/components/manufacturer-dashboard/analytics/LowStockTable';
import { RefreshCw, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Analytics = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
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

  // Check access - only manufacturers and admins can access
  if (role !== 'manufacturer' && role !== 'admin') {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="text-center py-10">
                <BarChart3 className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Manufacturer Access Required</h2>
                <p className="mb-6">You need manufacturer access to view analytics.</p>
                <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 sm:px-6">
        <div className="space-y-6">
          {/* Header with Refresh */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#333333] flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-[#E02020]" />
                Analytics Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">Comprehensive insights into your business performance</p>
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
      </div>
    </Layout>
  );
};

export default Analytics;
