
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OrdersTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Order ID</TableHead>
        <TableHead>Equipment</TableHead>
        <TableHead className="text-center">Status</TableHead>
        <TableHead className="text-right">Amount</TableHead>
        <TableHead className="text-center">Payment Method</TableHead>
        <TableHead className="text-center">Date</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default OrdersTableHeader;
