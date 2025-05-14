
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import EquipmentCard, { EquipmentProps } from '../EquipmentCard';
import { useEquipmentData } from '@/hooks/use-equipment-data';
import { Skeleton } from "@/components/ui/skeleton";

interface EquipmentListProps {
  onBookEquipment: (id: string) => void;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ onBookEquipment }) => {
  const { equipment, loading } = useEquipmentData();

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Available Equipment</h2>
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border rounded-md p-4">
              <Skeleton className="h-40 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Available Equipment</h2>
        <Badge variant="outline" className="flex items-center border-red-300 text-red-700">
          <Clock className="h-3 w-3 mr-1" />
          Updated recently
        </Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map(item => (
          <EquipmentCard 
            key={item.id} 
            id={item.id}
            name={item.name}
            image={item.image_url}
            type={item.category}
            location={item.location}
            cluster={item.cluster}
            status={item.type}
            pricePerUse={item.pricePerUse || 10}
            purchasePrice={item.purchasePrice}
            leaseRate={item.leaseRate}
            nextAvailable={item.nextAvailable}
            onBook={onBookEquipment}
          />
        ))}
      </div>
    </div>
  );
};

export default EquipmentList;
