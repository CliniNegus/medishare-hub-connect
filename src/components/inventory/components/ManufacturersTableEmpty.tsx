
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

const ManufacturersTableEmpty: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-12 text-gray-500">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium mb-2">No manufacturers found</p>
          <p className="text-sm">Try adjusting your search criteria</p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ManufacturersTableEmpty;
