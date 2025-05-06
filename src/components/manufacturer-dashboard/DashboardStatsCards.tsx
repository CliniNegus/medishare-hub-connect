
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, CircleDollarSign, CheckCircle, AlertCircle, Truck
} from "lucide-react";

interface StatsProps {
  totalEquipment: number;
  activeLease: number;
  maintenance: number;
  available: number;
  monthlyRevenue: number;
}

const DashboardStatsCards = ({ 
  totalEquipment, 
  activeLease, 
  maintenance, 
  available, 
  monthlyRevenue 
}: StatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
          <Package className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEquipment}</div>
          <p className="text-xs text-gray-500">Units in circulation</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
          <CheckCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeLease}</div>
          <p className="text-xs text-gray-500">Across multiple clusters</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{maintenance}</div>
          <p className="text-xs text-gray-500">Units in service</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Available</CardTitle>
          <Truck className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{available}</div>
          <p className="text-xs text-gray-500">Ready to deploy</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(monthlyRevenue / 1000).toFixed(0)}k</div>
          <p className="text-xs text-gray-500">+5.2% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStatsCards;
