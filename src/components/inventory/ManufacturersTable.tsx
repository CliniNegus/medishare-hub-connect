
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Eye } from "lucide-react";
import { Manufacturer } from '@/models/inventory';

interface ManufacturersTableProps {
  manufacturers: Manufacturer[];
  onViewManufacturer: (id: string) => void;
}

const ManufacturersTable: React.FC<ManufacturersTableProps> = ({ 
  manufacturers, 
  onViewManufacturer 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead className="text-center">Items Leased</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {manufacturers.map((manufacturer) => (
            <TableRow key={manufacturer.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                    <img src={manufacturer.logo} alt={manufacturer.name} className="w-6 h-6 object-contain" />
                  </div>
                  <div className="font-medium">{manufacturer.name}</div>
                </div>
              </TableCell>
              <TableCell>{manufacturer.contactPerson}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <div className="flex items-center text-sm">
                    <Mail className="h-3 w-3 mr-2 text-gray-500" />
                    {manufacturer.email}
                  </div>
                  <div className="flex items-center text-sm mt-1">
                    <Phone className="h-3 w-3 mr-2 text-gray-500" />
                    {manufacturer.phone}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">{manufacturer.itemsLeased}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onViewManufacturer(manufacturer.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManufacturersTable;
