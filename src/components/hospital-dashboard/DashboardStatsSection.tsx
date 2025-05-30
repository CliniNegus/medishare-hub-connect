
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Available Equipment</p>
                <p className="text-2xl font-bold text-blue-800">{stats.availableEquipment}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Active Bookings</p>
                <p className="text-2xl font-bold text-green-800">{stats.activeBookings}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Pending Orders</p>
                <p className="text-2xl font-bold text-purple-800">{stats.pendingOrders}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-[#E02020]/10 p-4 rounded-lg border border-[#E02020]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#E02020] font-medium">Monthly Savings</p>
                <p className="text-2xl font-bold text-[#E02020]">${stats.monthlySavings.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-[#E02020]/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-[#E02020]" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardStatsSection;
