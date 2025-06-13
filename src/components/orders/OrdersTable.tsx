
import React, { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import OrdersTableSearch from './components/OrdersTableSearch';
import OrdersTableHeader from './components/OrdersTableHeader';
import OrdersTableRow from './components/OrdersTableRow';
import OrdersTableEmpty from './components/OrdersTableEmpty';
import OrdersTableLoading from './components/OrdersTableLoading';
import { useOrdersData } from './hooks/useOrdersData';

interface OrdersTableProps {
  onViewOrder: (id: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ onViewOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { orders, loading } = useOrdersData();

  const filteredOrders = orders.filter(order => 
    (order.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || order.status === statusFilter)
  );

  if (loading) {
    return <OrdersTableLoading />;
  }

  return (
    <div className="space-y-4">
      <OrdersTableSearch
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="rounded-md border">
        <Table>
          <OrdersTableHeader />
          <TableBody>
            {filteredOrders.length === 0 ? (
              <OrdersTableEmpty />
            ) : (
              filteredOrders.map((order) => (
                <OrdersTableRow
                  key={order.id}
                  order={order}
                  onViewOrder={onViewOrder}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersTable;
