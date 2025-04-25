
import React from 'react';
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopBadge from './ShopBadge';
import { Equipment } from './types';

interface EquipmentListProps {
  shopId: string;
  equipment: Equipment[];
  loadingEquipment: boolean;
  onNavigate: (path: string) => void;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ 
  shopId, 
  equipment, 
  loadingEquipment, 
  onNavigate 
}) => {
  if (loadingEquipment) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (equipment.length > 0) {
    return (
      <div className="divide-y divide-gray-100">
        {equipment.map((item) => (
          <div key={item.id} className="py-2 flex justify-between items-center">
            <div className="flex items-center">
              <Package className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <div className="flex items-center">
              <ShopBadge className={item.status === 'Available' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-amber-100 text-amber-800 border-amber-300'}>
                {item.status}
              </ShopBadge>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="py-6 text-center">
      <p className="text-gray-500 mb-4">No equipment in this shop yet</p>
      <Button 
        className="bg-red-600 hover:bg-red-700"
        onClick={() => onNavigate(`/products?shop=${shopId}`)}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Equipment
      </Button>
    </div>
  );
};

export default EquipmentList;
