
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import EquipmentCard, { EquipmentProps } from '../EquipmentCard';
import { useEquipmentData } from '@/hooks/use-equipment-data';
import { Skeleton } from "@/components/ui/skeleton";

interface EquipmentListProps {
  onBookEquipment: (id: string) => void;
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ 
  onBookEquipment, 
  searchTerm, 
  statusFilter, 
  categoryFilter 
}) => {
  const { equipment, loading } = useEquipmentData();

  // Filter equipment based on search term, status, and category
  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'Available' && item.type === 'available') ||
      (statusFilter === 'In Use' && item.type === 'in-use') ||
      (statusFilter === 'Maintenance' && item.type === 'maintenance');
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

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
        <h2 className="text-lg font-medium">
          Available Equipment {filteredEquipment.length > 0 && `(${filteredEquipment.length})`}
        </h2>
        <Badge variant="outline" className="flex items-center border-red-300 text-red-700">
          <Clock className="h-3 w-3 mr-1" />
          Updated recently
        </Badge>
      </div>
      
      {filteredEquipment.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No equipment found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipment.map(item => (
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
      )}
    </div>
  );
};

export default EquipmentList;
