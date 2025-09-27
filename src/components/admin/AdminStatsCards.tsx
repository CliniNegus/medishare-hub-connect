
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
    <div className="stats-grid mb-4 sm:mb-6 md:mb-8 w-full max-w-full">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card 
            key={stat.title}
            className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${stat.bgGradient} animate-fade-in w-full max-w-full`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative p-3 sm:p-4">
              <CardTitle className="text-xs sm:text-sm font-semibold text-foreground text-responsive min-w-0 flex-1 truncate pr-2">
                {stat.title}
              </CardTitle>
              <div className={`p-1.5 sm:p-2 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-md flex-shrink-0`}>
                <Icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative p-3 sm:p-4">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="flex items-center text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 flex-shrink-0" />
                <span className="text-green-600 font-medium text-responsive truncate">{stat.change}</span>
              </div>
              
              {/* Decorative elements - Hidden on very small screens */}
              <div className="hidden sm:block absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-white/20 rounded-full -mr-10 md:-mr-16 -mt-10 md:-mt-16" />
              <div className="hidden sm:block absolute bottom-0 left-0 w-12 h-12 md:w-20 md:h-20 bg-white/10 rounded-full -ml-6 md:-ml-10 -mb-6 md:-mb-10" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStatsCards;
