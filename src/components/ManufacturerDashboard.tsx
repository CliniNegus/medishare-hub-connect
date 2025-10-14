
import React, { useState } from 'react';
import { useManufacturerShops } from './manufacturer-dashboard/hooks/useManufacturerShops';
import { useManufacturerStats } from '@/hooks/use-manufacturer-stats';
import { 
  ManufacturerHeader, 
  DashboardStatsCards, 
  VirtualShopsSection, 
  DashboardTabs 
} from './manufacturer-dashboard';
import { TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent } from "./ui/card";

const ManufacturerDashboard = () => {
  const { virtualShops, loadingShops } = useManufacturerShops();
  const { stats, loading: statsLoading, error } = useManufacturerStats();

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-full overflow-x-hidden box-border">
      {/* Modern Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-r from-[#E02020] to-[#c01c1c] text-white w-full">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 w-full max-w-full">
          <ManufacturerHeader />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 -mt-4 relative z-20 w-full max-w-full box-border">
        {/* Performance Overview */}
        <Card className="mb-8 shadow-lg border-0 w-full max-w-full">
          <CardContent className="p-4 sm:p-6 w-full max-w-full box-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-[#333333] flex items-center">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#E02020] flex-shrink-0" />
                <span>Performance Overview</span>
              </h2>
              <div className="flex items-center text-xs sm:text-sm text-green-600 bg-green-50 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                <span>Real-time data</span>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                Error loading stats: {error}
              </div>
            )}
            
            <DashboardStatsCards 
              totalEquipment={stats.totalEquipment}
              activeLease={stats.activeLease}
              maintenance={stats.maintenance}
              available={stats.available}
              monthlyRevenue={stats.monthlyRevenue}
              loading={statsLoading}
            />
          </CardContent>
        </Card>

        {/* Virtual Shops Section */}
        <div className="mb-8 w-full max-w-full">
          <VirtualShopsSection 
            virtualShops={virtualShops} 
            loadingShops={loadingShops} 
          />
        </div>

        {/* Management Tabs */}
        <Card className="shadow-lg border-0 mb-8 w-full max-w-full">
          <CardContent className="p-0 w-full max-w-full overflow-hidden">
            <DashboardTabs />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
