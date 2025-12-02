import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useManufacturerOrders, OrderStatus } from '@/hooks/useManufacturerOrders';
import { ManufacturerOrderCard } from '@/components/manufacturer-orders/ManufacturerOrderCard';
import { ManufacturerOrderStats } from '@/components/manufacturer-orders/ManufacturerOrderStats';
import { Loader2, ClipboardList, Package } from 'lucide-react';

const ManufacturerOrders = () => {
  const { orders, loading, updateOrderStatus, refetch } = useManufacturerOrders();
  const [activeTab, setActiveTab] = useState<string>('all');

  const getFilteredOrders = (status?: OrderStatus | 'all') => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    completed: orders.filter(o => o.status === 'completed').length,
    declined: orders.filter(o => o.status === 'declined').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#E02020]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#333333] flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-[#E02020]" />
            Order Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track customer orders for your products
          </p>
        </div>
      </div>

      <ManufacturerOrderStats orders={orders} />

      <Card>
        <CardHeader>
          <CardTitle>Customer Orders</CardTitle>
          <CardDescription>
            View and manage all orders from your customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="all">
                All ({statusCounts.all})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({statusCounts.pending})
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Accepted ({statusCounts.accepted})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Processing ({statusCounts.processing})
              </TabsTrigger>
              <TabsTrigger value="shipped">
                Shipped ({statusCounts.shipped})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({statusCounts.completed})
              </TabsTrigger>
              <TabsTrigger value="declined">
                Declined ({statusCounts.declined})
              </TabsTrigger>
            </TabsList>

            {(['all', 'pending', 'accepted', 'processing', 'shipped', 'completed', 'declined'] as const).map((status) => (
              <TabsContent key={status} value={status} className="space-y-4 mt-4">
                {getFilteredOrders(status).length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No {status !== 'all' ? status : ''} orders found</p>
                  </div>
                ) : (
                  getFilteredOrders(status).map((order) => (
                    <ManufacturerOrderCard
                      key={order.id}
                      order={order}
                      onUpdateStatus={updateOrderStatus}
                      onRefresh={refetch}
                    />
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManufacturerOrders;
