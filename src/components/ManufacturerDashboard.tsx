
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
    <div className="min-h-screen bg-background overflow-x-hidden w-full max-w-full">
      {/* Modern Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-r from-[#E02020] to-[#c01c1c] text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
          <ManufacturerHeader />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-full px-2 sm:px-4 md:px-6 -mt-2 sm:-mt-4 relative z-20">
        <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
          {/* Performance Overview */}
          <Card className="shadow-lg border-0 w-full max-w-full">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#E02020] flex-shrink-0" />
                  <span className="truncate">Performance Overview</span>
                </h2>
                <div className="flex items-center text-xs sm:text-sm text-green-600 bg-green-50 px-2 sm:px-3 py-1 rounded-full w-fit">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                  <span className="whitespace-nowrap">Real-time data</span>
                </div>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
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
          <div className="w-full max-w-full">
            <VirtualShopsSection 
              virtualShops={virtualShops} 
              loadingShops={loadingShops} 
            />
          </div>

          {/* Management Tabs */}
          <Card className="shadow-lg border-0 w-full max-w-full">
            <CardContent className="p-0 overflow-hidden">
              <DashboardTabs />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
