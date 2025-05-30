
import React from 'react';
import { Building, Package, Activity, DollarSign, TrendingUp, Users, AlertTriangle, ShoppingCart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatsProps {
  stats: {
    hospitals: number;
    manufacturers: number;
    investors: number;
    equipmentItems: number;
    activeLeases: number;
    pendingOrders: number;
    maintenanceAlerts: number;
    totalRevenue: number;
  };
}

const AdminStatsCards = ({ stats }: StatsProps) => {
  const statsConfig = [
    {
      title: "Total Hospitals",
      value: stats.hospitals,
      change: `${stats.hospitals} registered`,
      icon: Building,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Equipment Items",
      value: stats.equipmentItems,
      change: `${stats.activeLeases} active leases`,
      icon: Package,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
    },
    {
      title: "Manufacturers",
      value: stats.manufacturers,
      change: `${stats.investors} investors`,
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      change: `${stats.maintenanceAlerts} maintenance alerts`,
      icon: ShoppingCart,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
    },
    {
      title: "Active Leases",
      value: stats.activeLeases,
      change: "Currently active",
      icon: Activity,
      gradient: "from-[#E02020] to-[#c01010]",
      bgGradient: "from-red-50 to-red-100",
    },
    {
      title: "Maintenance Alerts",
      value: stats.maintenanceAlerts,
      change: "Require attention",
      icon: AlertTriangle,
      gradient: "from-yellow-500 to-yellow-600",
      bgGradient: "from-yellow-50 to-yellow-100",
    },
    {
      title: "Annual Revenue",
      value: `$${(stats.totalRevenue / 1000).toFixed(0)}k`,
      change: "From active leases",
      icon: DollarSign,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
    },
    {
      title: "Total Users",
      value: stats.manufacturers + stats.investors + stats.hospitals,
      change: "Platform users",
      icon: Users,
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card 
            key={stat.title}
            className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${stat.bgGradient} animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-semibold text-gray-700">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-md`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">{stat.change}</span>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStatsCards;
