
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Share2 } from "lucide-react";
import { InventoryItem } from '@/models/inventory';

interface InventoryTableRowProps {
  item: InventoryItem;
  onViewDetails: (item: InventoryItem) => void;
  onShare: (item: InventoryItem) => void;
}

const InventoryTableRow: React.FC<InventoryTableRowProps> = ({
  item,
  onViewDetails,
  onShare
}) => {
  const getStockStatus = (currentStock: number) => {
    if (currentStock === 0) return { color: 'text-red-500', status: 'Out of Stock' };
    if (currentStock < 5) return { color: 'text-orange-500', status: 'Low Stock' };
    return { color: 'text-green-500', status: 'In Stock' };
  };

  const stockStatus = getStockStatus(item.currentStock);

  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onViewDetails(item)}
    >
      <TableCell>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-equipment.jpg';
              }}
            />
          </div>
          <div>
            <div className="font-semibold text-[#333333]">{item.name}</div>
            <div className="text-sm text-gray-500">{item.manufacturer}</div>
            <div className="text-xs text-gray-400">{item.location}</div>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
          {item.sku}
        </code>
      </TableCell>
      
      <TableCell>
        <Badge variant="outline" className="capitalize font-medium">
          {item.category}
        </Badge>
      </TableCell>
      
      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-1">
          <span className={`font-semibold ${stockStatus.color}`}>
            {item.currentStock}
          </span>
          <span className={`text-xs ${stockStatus.color}`}>
            {stockStatus.status}
          </span>
        </div>
      </TableCell>
      
      <TableCell className="text-center">
        <span className="font-medium text-blue-600">
          {item.availableForSharing}
        </span>
      </TableCell>
      
      <TableCell className="text-right">
        <div className="flex flex-col items-end gap-1">
          <span className="font-semibold text-[#333333]">
            Ksh {item.price.toLocaleString()}
          </span>
          {item.leasingPrice > 0 && (
            <span className="text-xs text-gray-500">
              Lease: Ksh {item.leasingPrice}/mo
            </span>
          )}
        </div>
      </TableCell>
      
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => { 
              e.stopPropagation(); 
              onViewDetails(item);
            }}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => { 
              e.stopPropagation(); 
              onShare(item);
            }}
            className="hover:bg-green-50 hover:text-green-600"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default InventoryTableRow;
