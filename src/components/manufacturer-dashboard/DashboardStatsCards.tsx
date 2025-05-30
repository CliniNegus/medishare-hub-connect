
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Package, CircleDollarSign, CheckCircle, AlertCircle, Truck
} from "lucide-react";

interface StatsProps {
  totalEquipment: number;
  activeLease: number;
  maintenance: number;
  available: number;
  monthlyRevenue: number;
  loading?: boolean;
}

const DashboardStatsCards = ({ 
  totalEquipment, 
  activeLease, 
  maintenance, 
  available, 
  monthlyRevenue,
  loading = false
}: StatsProps) => {
  const stats = [
    {
      title: "Total Equipment",
      value: totalEquipment,
      description: "Units in circulation",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Leases",
      value: activeLease,
      description: "Currently leased units",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Maintenance",
      value: maintenance,
      description: "Units in service",
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Available",
      value: available,
      description: "Ready to deploy",
      icon: Truck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Monthly Revenue",
      value: `$${(monthlyRevenue / 1000).toFixed(1)}k`,
      description: "From active leases",
      icon: CircleDollarSign,
      color: "text-[#E02020]",
      bgColor: "bg-red-50",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((_, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#333333]">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-[#333333] mb-1">{stat.value}</div>
            <p className="text-xs text-gray-500">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStatsCards;
