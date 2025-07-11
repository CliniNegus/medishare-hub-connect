
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import OrderDetailsModal from '../OrderDetailsModal';

interface Order {
  id: string;
  equipment_id: string;
  user_id: string;
  amount: number;
  status: string;
  payment_method: string;
  shipping_address: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  equipment?: {
    name: string;
    manufacturer?: string;
  };
}

interface OrdersTableRowProps {
  order: Order;
  onViewOrder: (id: string) => void;
}

const OrdersTableRow: React.FC<OrdersTableRowProps> = ({ order, onViewOrder }) => {
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOrderDetails(true);
    onViewOrder(order.id); // Keep the existing callback for any external functionality
  };

  const handleCloseModal = () => {
    setShowOrderDetails(false);
  };

  return (
    <>
      <TableRow 
        key={order.id} 
        className="cursor-pointer hover:bg-gray-50"
      >
        <TableCell>
          <div className="font-medium">{order.id.slice(0, 8)}...</div>
        </TableCell>
        <TableCell>
          <div>{order.equipment?.name || 'Unknown Equipment'}</div>
          <div className="text-xs text-gray-500">{order.equipment?.manufacturer}</div>
        </TableCell>
        <TableCell className="text-center">
          <Badge className={`capitalize ${getStatusColor(order.status)}`}>
            {order.status}
          </Badge>
        </TableCell>
        <TableCell className="text-right font-medium">Ksh {order.amount.toLocaleString()}</TableCell>
        <TableCell className="text-center capitalize">{order.payment_method}</TableCell>
        <TableCell className="text-center text-sm">{new Date(order.created_at).toLocaleDateString()}</TableCell>
        <TableCell className="text-right">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleViewClick}
            className="hover:bg-[#E02020] hover:text-white"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </TableCell>
      </TableRow>

      <OrderDetailsModal
        isOpen={showOrderDetails}
        onClose={handleCloseModal}
        order={order}
      />
    </>
  );
};

export default OrdersTableRow;
