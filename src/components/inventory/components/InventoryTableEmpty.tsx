
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Package } from "lucide-react";

const InventoryTableEmpty: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-12 text-gray-500">
        <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium mb-2">No inventory items found</p>
        <p className="text-sm">Try adjusting your search criteria or add new equipment</p>
      </TableCell>
    </TableRow>
  );
};

export default InventoryTableEmpty;
