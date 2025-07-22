
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { InventoryItem } from '@/models/inventory';

interface InventoryStatsProps {
  items: InventoryItem[];
}

const InventoryStats: React.FC<InventoryStatsProps> = ({ items }) => {
  // Calculate statistics from real data
  const totalItems = items.reduce((sum, item) => sum + item.currentStock, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.currentStock), 0);
  const availableItems = items.reduce((sum, item) => sum + item.availableForSharing, 0);
  const lowStockItems = items.filter(item => item.currentStock < 5).length;
  const outOfStockItems = items.filter(item => item.currentStock === 0).length;
  const itemsInUse = items.reduce((sum, item) => sum + item.inUse, 0);
  
  // Calculate percentage metrics
  const utilizationRate = totalItems > 0 ? (itemsInUse / totalItems) * 100 : 0;
  const availabilityRate = totalItems > 0 ? (availableItems / totalItems) * 100 : 0;

  // Calculate hospital-specific metrics
  const purchasedItems = items.filter(item => item.cluster === 'Purchased').length;
  const leasedItems = items.filter(item => item.cluster === 'Leased').length;
  const bookedItems = items.filter(item => item.cluster === 'Booked').length;
  const activeEquipment = items.filter(item => item.inUse > 0).length;

  const stats = [
    {
      title: "Your Equipment",
      value: totalItems.toLocaleString(),
      change: `${purchasedItems} purchased`,
      changeType: "positive" as const,
      icon: Package,
      description: `${leasedItems} leased, ${bookedItems} booked`,
      color: "border-l-blue-500"
    },
    {
      title: "Total Invested",
      value: `Ksh ${totalValue.toLocaleString()}`,
      change: "Equipment value",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Total spent on equipment",
      color: "border-l-green-500"
    },
    {
      title: "Active Equipment",
      value: activeEquipment.toLocaleString(),
      change: `${utilizationRate.toFixed(1)}% utilization`,
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "Currently in use",
      color: "border-l-purple-500"
    },
    {
      title: "Equipment Status",
      value: availableItems.toLocaleString(),
      change: "Available for use",
      changeType: availableItems > 0 ? "positive" as const : "negative" as const,
      icon: AlertTriangle,
      description: `${totalItems - availableItems} not available`,
      color: "border-l-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`border-l-4 ${stat.color} hover:shadow-lg transition-shadow duration-200`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-[#333333]">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between">
                  <span 
                    className={`text-xs font-medium ${
                      stat.changeType === 'positive' 
                        ? 'text-green-600' 
                        : stat.changeType === 'negative'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default InventoryStats;
