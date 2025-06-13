
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ManufacturersTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow className="bg-gray-50">
        <TableHead className="font-semibold text-[#333333]">Manufacturer</TableHead>
        <TableHead className="font-semibold text-[#333333]">Contact Information</TableHead>
        <TableHead className="text-center font-semibold text-[#333333]">Items Leased</TableHead>
        <TableHead className="text-center font-semibold text-[#333333]">Status</TableHead>
        <TableHead className="text-right font-semibold text-[#333333]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ManufacturersTableHeader;
