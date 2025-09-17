
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ManufacturersTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow className="bg-gray-50">
        <TableHead className="font-semibold text-[#333333] min-w-[150px]">Manufacturer</TableHead>
        <TableHead className="font-semibold text-[#333333] min-w-[180px] hidden sm:table-cell">Contact Information</TableHead>
        <TableHead className="text-center font-semibold text-[#333333] min-w-[100px]">Items Leased</TableHead>
        <TableHead className="text-center font-semibold text-[#333333] min-w-[80px] hidden md:table-cell">Status</TableHead>
        <TableHead className="text-right font-semibold text-[#333333] min-w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ManufacturersTableHeader;
