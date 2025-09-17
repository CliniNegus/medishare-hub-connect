
import React from 'react';
import { Store, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ShopCard from './ShopCard';
import { Shop } from './types';
import CreateShopDialog from './CreateShopDialog';

interface ShopsListProps {
  shops: Shop[];
  loading: boolean;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  newShop: {
    name: string;
    country: string;
    description: string;
  };
  countries: string[];
  handleShopChange: (field: string, value: string) => void;
  handleCreateShop: () => Promise<void>;
  onRefresh: () => void;
}

const ShopsList: React.FC<ShopsListProps> = ({ 
  shops, 
  loading,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  newShop,
  countries,
  handleShopChange,
  handleCreateShop,
  onRefresh
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="p-6 sm:p-10 text-center">
          <Store className="h-12 sm:h-16 w-12 sm:w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg sm:text-xl font-medium mb-2">No virtual shops yet</h3>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">Create your first virtual shop to start managing medical equipment</p>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-sm sm:text-base"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Create Your First Shop
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {shops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} onRefresh={onRefresh} />
      ))}
    </div>
  );
};

export default ShopsList;
