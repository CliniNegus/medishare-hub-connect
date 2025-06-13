
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ShoppingCart, Package, Calendar, DollarSign } from "lucide-react";
import { useRealTimeOrders } from '@/hooks/use-real-time-orders';

const RecentOrdersSection: React.FC = () => {
  const { orders, loading } = useRealTimeOrders();

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

  if (loading) {
    return (
      <Card className="border-[#E02020]/20">
        <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20">
          <CardTitle className="text-[#333333] flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-[#E02020]" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#E02020]/20">
      <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20">
        <CardTitle className="text-[#333333] flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2 text-[#E02020]" />
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No recent orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#333333]">{order.equipment?.name || 'Unknown Equipment'}</h3>
                    <p className="text-sm text-gray-600">Order #{order.id.slice(0, 8)}...</p>
                  </div>
                  <Badge className={`capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Ksh {order.amount?.toLocaleString() || '0'}
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Payment:</span> {order.payment_method}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrdersSection;
