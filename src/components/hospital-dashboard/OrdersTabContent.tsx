
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ShoppingCart, 
  Package, 
  Clock, 
  CircleDollarSign,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreateOrderModal from '@/components/orders/CreateOrderModal';

interface Order {
  id: string;
  equipment_id: string;
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

const OrdersTabContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch orders from Supabase
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['hospital-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          equipment:equipment_id (
            name,
            manufacturer
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error fetching orders",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }

      return data as Order[];
    },
    enabled: !!user,
  });

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const processingOrders = orders.filter(order => order.status === 'processing').length;
  const activeOrders = pendingOrders + processingOrders;
  const completedOrders = orders.filter(order => order.status === 'delivered').length;
  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + Number(order.amount), 0);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleOrderCreated = () => {
    refetch();
    toast({
      title: "Order created successfully",
      description: "Your order has been submitted and is being processed.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E02020] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-[#333333]">Order Management</h3>
          <p className="text-gray-600">Track and manage your equipment orders</p>
        </div>
        <Button 
          onClick={() => setCreateModalOpen(true)}
          className="bg-[#E02020] hover:bg-[#c01010] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
              <p className="text-xs text-gray-500">All time</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Orders</p>
              <p className="text-2xl font-bold">{activeOrders}</p>
              <p className="text-xs text-gray-500">{pendingOrders} pending, {processingOrders} processing</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Orders</p>
              <p className="text-2xl font-bold">{completedOrders}</p>
              <p className="text-xs text-gray-500">Successfully delivered</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">From completed orders</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <CircleDollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-auto flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by order ID or equipment..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <select 
                className="border rounded-md px-3 py-2 bg-white text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No orders found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-sm">
                          {order.id.slice(0, 8)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.equipment?.name || 'Unknown Equipment'}</div>
                          <div className="text-xs text-gray-500">{order.equipment?.manufacturer}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${Number(order.amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="capitalize">{order.payment_method}</TableCell>
                      <TableCell className="text-center text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CreateOrderModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  );
};

export default OrdersTabContent;
