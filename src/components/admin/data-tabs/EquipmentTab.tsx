
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

interface EquipmentTabProps {
  equipment: Equipment[];
}

const EquipmentTab: React.FC<EquipmentTabProps> = ({ equipment }) => {
  return (
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
              <span className={`px-2 py-1 rounded-full text-xs 
                ${item.status === 'Leased' ? 'bg-green-100 text-green-800' : 
                  item.status === 'Available' ? 'bg-blue-100 text-blue-800' : 
                  'bg-yellow-100 text-yellow-800'}`}>
                {item.status}
              </span>
            </TableCell>
            <TableCell>{item.location}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EquipmentTab;
