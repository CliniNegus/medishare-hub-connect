
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { ShoppingCart } from "lucide-react";

const OrdersTableEmpty: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
        <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>No orders found</p>
      </TableCell>
    </TableRow>
  );
};

export default OrdersTableEmpty;
