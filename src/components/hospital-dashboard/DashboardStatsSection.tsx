
import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Activity, TrendingUp } from "lucide-react";
import { useHospitalDashboard } from '@/hooks/use-hospital-dashboard';

const DashboardStatsSection: React.FC = () => {
  const { stats, loading } = useHospitalDashboard();

  if (loading) {
    return (
      <Card className="mb-8 shadow-lg border-0 w-full max-w-full">
        <CardContent className="p-4 sm:p-6 w-full max-w-full box-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-[#333333] flex items-center">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#E02020] flex-shrink-0" />
              <span>Hospital Overview</span>
            </h2>
            <div className="animate-pulse h-6 w-32 bg-gray-200 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-full">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 animate-pulse w-full">
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
    <Card className="mb-8 shadow-lg border-0 w-full max-w-full">
      <CardContent className="p-4 sm:p-6 w-full max-w-full box-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-[#333333] flex items-center">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#E02020] flex-shrink-0" />
            <span>Hospital Overview</span>
          </h2>
          <div className="flex items-center text-xs sm:text-sm text-green-600 bg-green-50 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
            <span>Utilization: {stats.utilizationRate}%</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-full">
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200 w-full">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-green-600 font-medium truncate">Active Bookings</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-800">{stats.activeBookings}</p>
              </div>
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200 w-full">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-purple-600 font-medium truncate">Pending Orders</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-800">{stats.pendingOrders}</p>
              </div>
              <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-[#E02020]/10 p-3 sm:p-4 rounded-lg border border-[#E02020]/20 w-full sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-[#E02020] font-medium truncate">Monthly Savings</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#E02020]">${stats.monthlySavings.toLocaleString()}</p>
              </div>
              <div className="p-1.5 sm:p-2 bg-[#E02020]/10 rounded-lg flex-shrink-0">
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
