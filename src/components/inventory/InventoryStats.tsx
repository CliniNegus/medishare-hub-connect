
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

  const stats = [
    {
      title: "Total Equipment",
      value: totalItems.toLocaleString(),
      change: "+2.5%",
      changeType: "positive" as const,
      icon: Package,
      description: `${items.length} unique items`,
      color: "border-l-blue-500"
    },
    {
      title: "Total Value",
      value: `$${totalValue.toLocaleString()}`,
      change: "+8.2%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Inventory worth",
      color: "border-l-green-500"
    },
    {
      title: "Utilization Rate",
      value: `${utilizationRate.toFixed(1)}%`,
      change: "+1.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: `${itemsInUse} items in use`,
      color: "border-l-purple-500"
    },
    {
      title: "Stock Alerts",
      value: lowStockItems + outOfStockItems,
      change: lowStockItems > 0 || outOfStockItems > 0 ? "Needs attention" : "All good",
      changeType: (lowStockItems > 0 || outOfStockItems > 0) ? "negative" as const : "positive" as const,
      icon: AlertTriangle,
      description: `${lowStockItems} low stock, ${outOfStockItems} out of stock`,
      color: "border-l-red-500"
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
