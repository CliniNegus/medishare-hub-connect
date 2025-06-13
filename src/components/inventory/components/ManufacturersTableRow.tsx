
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Eye } from "lucide-react";
import { Manufacturer } from '@/models/inventory';

interface ManufacturersTableRowProps {
  manufacturer: Manufacturer;
  onViewManufacturer: (id: string) => void;
  onContact: (manufacturer: Manufacturer, type: 'email' | 'phone') => void;
}

const ManufacturersTableRow: React.FC<ManufacturersTableRowProps> = ({
  manufacturer,
  onViewManufacturer,
  onContact
}) => {
  const getActivityStatus = (itemsLeased: number) => {
    if (itemsLeased === 0) return { color: 'bg-gray-100 text-gray-800', label: 'Inactive' };
    if (itemsLeased < 5) return { color: 'bg-yellow-100 text-yellow-800', label: 'Low Activity' };
    return { color: 'bg-green-100 text-green-800', label: 'Active' };
  };

  const activityStatus = getActivityStatus(manufacturer.itemsLeased);

  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onViewManufacturer(manufacturer.id)}
    >
      <TableCell>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            <img 
              src={manufacturer.logo} 
              alt={manufacturer.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-logo.png';
              }}
            />
          </div>
          <div>
            <div className="font-semibold text-[#333333]">{manufacturer.name}</div>
            <div className="text-sm text-gray-500">{manufacturer.contactPerson}</div>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{manufacturer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{manufacturer.phone}</span>
          </div>
        </div>
      </TableCell>
      
      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-bold text-[#333333]">
            {manufacturer.itemsLeased}
          </span>
          <span className="text-xs text-gray-500">items</span>
        </div>
      </TableCell>
      
      <TableCell className="text-center">
        <Badge className={`${activityStatus.color} hover:${activityStatus.color}`}>
          {activityStatus.label}
        </Badge>
      </TableCell>
      
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => { 
              e.stopPropagation(); 
              onViewManufacturer(manufacturer.id);
            }}
            className="hover:bg-blue-50 hover:text-blue-600"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => { 
              e.stopPropagation(); 
              onContact(manufacturer, 'email');
            }}
            className="hover:bg-green-50 hover:text-green-600"
            title="Send Email"
          >
            <Mail className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => { 
              e.stopPropagation(); 
              onContact(manufacturer, 'phone');
            }}
            className="hover:bg-blue-50 hover:text-blue-600"
            title="Call"
          >
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ManufacturersTableRow;
