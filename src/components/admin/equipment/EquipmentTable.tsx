
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  status: string;
  location: string;
}

interface EquipmentTableProps {
  equipment: Equipment[];
}

const EquipmentTable = ({ equipment }: EquipmentTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Equipment</TableHead>
          <TableHead>Manufacturer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {equipment.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.id.substring(0, 8)}...</TableCell>
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
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="border-[#E02020] text-[#E02020] hover:bg-red-50">Edit</Button>
                <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">View</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EquipmentTable;
