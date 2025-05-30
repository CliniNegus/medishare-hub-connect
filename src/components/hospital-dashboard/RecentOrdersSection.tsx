
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  ChevronRight, 
  Calendar,
  Package,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RecentOrder {
  id: string;
  equipment_id: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  equipment?: {
    name: string;
    manufacturer?: string;
  };
}

interface RecentOrdersSectionProps {
  onViewAllOrders: () => void;
}

const RecentOrdersSection: React.FC<RecentOrdersSectionProps> = ({ onViewAllOrders }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch recent orders from Supabase
  const { data: recentOrders = [], isLoading } = useQuery({
    queryKey: ['recent-orders', user?.id],
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
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent orders:', error);
        toast({
          title: "Error fetching recent orders",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }

      return data as RecentOrder[];
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
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

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'processing': return <Package className="h-3 w-3" />;
      case 'shipped': return <Package className="h-3 w-3" />;
      case 'delivered': return <Package className="h-3 w-3" />;
      default: return <ShoppingCart className="h-3 w-3" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <ShoppingCart className="h-5 w-5 mr-2 text-[#E02020]" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <ShoppingCart className="h-5 w-5 mr-2 text-[#E02020]" />
            Recent Orders
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onViewAllOrders}
            className="text-[#E02020] hover:text-[#c01010]"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No recent orders</p>
            <p className="text-xs text-gray-400">Your orders will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-full ${getStatusColor(order.status).replace('text-', 'bg-').replace('800', '100')}`}>
                      {getStatusIcon(order.status)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {order.equipment?.name || 'Unknown Equipment'}
                      </p>
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-3">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                      <span className="font-medium text-gray-900">
                        ${Number(order.amount).toLocaleString()}
                      </span>
                      <span className="capitalize">
                        {order.payment_method}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrdersSection;
