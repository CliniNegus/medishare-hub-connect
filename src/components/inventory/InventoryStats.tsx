
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Package, Share2, AlertTriangle, TrendingUp } from "lucide-react";
import { InventoryItem } from '@/models/inventory';

interface InventoryStatsProps {
  items: InventoryItem[];
}

const InventoryStats: React.FC<InventoryStatsProps> = ({ items }) => {
  // Calculate stats
  const totalItems = items.length;
  const totalStock = items.reduce((sum, item) => sum + item.currentStock, 0);
  const itemsInUse = items.reduce((sum, item) => sum + item.inUse, 0);
  const itemsOnMaintenance = items.reduce((sum, item) => sum + item.onMaintenance, 0);
  const availableForSharing = items.reduce((sum, item) => sum + item.availableForSharing, 0);
  
  const utilizationRate = totalStock > 0 ? Math.round((itemsInUse / totalStock) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Inventory</p>
            <p className="text-2xl font-bold">{totalStock}</p>
            <p className="text-xs text-gray-500">{totalItems} unique items</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Items In Use</p>
            <p className="text-2xl font-bold">{itemsInUse}</p>
            <p className="text-xs text-gray-500">{utilizationRate}% utilization</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Shareable Items</p>
            <p className="text-2xl font-bold">{availableForSharing}</p>
            <p className="text-xs text-gray-500">Available for cluster use</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Share2 className="h-6 w-6 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">On Maintenance</p>
            <p className="text-2xl font-bold">{itemsOnMaintenance}</p>
            <p className="text-xs text-gray-500">Temporarily unavailable</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryStats;
