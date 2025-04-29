
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Equipment } from '../types';
import { Badge } from "@/components/ui/badge";

interface EquipmentTabProps {
  equipment: Equipment[];
}

const EquipmentTab: React.FC<EquipmentTabProps> = ({ equipment }) => {
  if (equipment.length === 0) {
    return <p className="text-gray-500 py-4">No equipment data available.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Equipment Overview</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Equipment</TableHead>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipment.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
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
  );
};

export default EquipmentTab;
