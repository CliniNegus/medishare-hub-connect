
import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Activity, TrendingUp } from "lucide-react";
import { useHospitalDashboard } from '@/hooks/use-hospital-dashboard';

const DashboardStatsSection: React.FC = () => {
  const { stats, loading } = useHospitalDashboard();

  if (loading) {
    return (
      <Card className="mb-8 shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#333333] flex items-center">
              <Activity className="h-5 w-5 mr-2 text-[#E02020]" />
              Hospital Overview
            </h2>
            <div className="animate-pulse h-6 w-32 bg-gray-200 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded-full w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#333333] flex items-center">
            <Activity className="h-5 w-5 mr-2 text-[#E02020]" />
            Hospital Overview
          </h2>
          <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <TrendingUp className="h-4 w-4 mr-1" />
            Equipment utilization: {stats.utilizationRate}%
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-full">
          <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg border border-green-200 dark:border-green-800 w-full max-w-full">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium truncate">Active Bookings</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-800 dark:text-green-300">{stats.activeBookings}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-800/40 rounded-lg flex-shrink-0">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-lg border border-purple-200 dark:border-purple-800 w-full max-w-full">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium truncate">Pending Orders</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-800 dark:text-purple-300">{stats.pendingOrders}</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-800/40 rounded-lg flex-shrink-0">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          <div className="bg-[#E02020]/10 dark:bg-[#E02020]/20 p-3 sm:p-4 rounded-lg border border-[#E02020]/20 dark:border-[#E02020]/40 sm:col-span-2 lg:col-span-1 w-full max-w-full">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-[#E02020] dark:text-[#E02020] font-medium truncate">Monthly Savings</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#E02020] dark:text-[#E02020]">${stats.monthlySavings.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-[#E02020]/10 dark:bg-[#E02020]/20 rounded-lg flex-shrink-0">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-[#E02020]" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardStatsSection;
