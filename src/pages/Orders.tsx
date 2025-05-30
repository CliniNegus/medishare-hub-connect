
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Header from '@/components/Header';
import OrdersTable from '@/components/orders/OrdersTable';
import OrderStats from '@/components/orders/OrderStats';
import CreateOrderModal from '@/components/orders/CreateOrderModal';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleViewOrder = (id: string) => {
    setSelectedOrder(id);
    // In a real app, you would navigate to a details view or open a modal
    console.log(`View order with ID: ${id}`);
  };

  const handleOrderCreated = () => {
    // Refresh the orders list by incrementing the key
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
            <Button 
              onClick={() => setCreateModalOpen(true)}
              className="bg-[#E02020] hover:bg-[#c01010] text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Order
            </Button>
          </div>

          <OrderStats />

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <OrdersTable 
              key={refreshKey}
              onViewOrder={handleViewOrder} 
            />
          </div>
        </div>
      </main>

      <CreateOrderModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  );
};

export default Orders;
