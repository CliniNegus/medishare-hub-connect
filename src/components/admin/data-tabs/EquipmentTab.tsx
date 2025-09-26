
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Equipment } from './types';
import { Badge } from "@/components/ui/badge";

interface EquipmentTabProps {
  equipment: Equipment[];
}

const EquipmentTab: React.FC<EquipmentTabProps> = ({ equipment }) => {
  if (equipment.length === 0) {
    return <p className="text-gray-500 py-4">No equipment data available.</p>;
  }

  return (
    <div className="space-y-4">
      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-3">
        {equipment.map((item) => (
          <div key={item.id} className="mobile-card">
            <div className="mobile-card-row">
              <span className="mobile-card-label">ID:</span>
              <span className="mobile-card-value font-mono text-xs">{item.id}</span>
            </div>
            <div className="mobile-card-row">
              <span className="mobile-card-label">Equipment:</span>
              <span className="mobile-card-value font-medium">{item.name}</span>
            </div>
            <div className="mobile-card-row">
              <span className="mobile-card-label">Manufacturer:</span>
              <span className="mobile-card-value">{item.manufacturer}</span>
            </div>
            <div className="mobile-card-row">
              <span className="mobile-card-label">Status:</span>
              <span className="mobile-card-value">
                <Badge 
                  className={
                    item.status === 'Available' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                    item.status === 'Leased' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                    'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                  }
                >
                  {item.status}
                </Badge>
              </span>
            </div>
            <div className="mobile-card-row">
              <span className="mobile-card-label">Location:</span>
              <span className="mobile-card-value">{item.location}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block table-responsive">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[15%]">ID</TableHead>
              <TableHead className="w-[25%]">Equipment</TableHead>
              <TableHead className="w-[20%]">Manufacturer</TableHead>
              <TableHead className="w-[15%]">Status</TableHead>
              <TableHead className="w-[25%]">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-sm">{item.id}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.manufacturer}</TableCell>
                <TableCell>
                  <Badge 
                    className={
                      item.status === 'Available' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                      item.status === 'Leased' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                      'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EquipmentTab;
