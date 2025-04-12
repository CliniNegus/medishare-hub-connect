
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Header from '@/components/Header';
import OrdersTable from '@/components/orders/OrdersTable';
import OrderStats from '@/components/orders/OrderStats';
import { orderData } from '@/data/mockData';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const handleViewOrder = (id: string) => {
    setSelectedOrder(id);
    // In a real app, you would navigate to a details view or open a modal
    console.log(`View order with ID: ${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Order
            </Button>
          </div>

          <OrderStats orders={orderData} />

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <OrdersTable 
              orders={orderData} 
              onViewOrder={handleViewOrder} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;
