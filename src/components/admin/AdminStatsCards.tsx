
import React from 'react';
import { Building, Package, Activity, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatsProps {
  stats: {
    hospitals: number;
    equipmentItems: number;
    activeLeases: number;
    totalRevenue: number;
  };
}

const AdminStatsCards = ({ stats }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Hospitals</CardTitle>
          <Building className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.hospitals}</div>
          <p className="text-xs text-gray-500">+2 this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Equipment Items</CardTitle>
          <Package className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.equipmentItems}</div>
          <p className="text-xs text-gray-500">+12 this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
          <Activity className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeLeases}</div>
          <p className="text-xs text-gray-500">+7 this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(stats.totalRevenue / 1000).toFixed(0)}k</div>
          <p className="text-xs text-gray-500">+8.2% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatsCards;
