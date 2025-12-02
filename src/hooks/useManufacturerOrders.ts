import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type OrderStatus = 'pending' | 'accepted' | 'declined' | 'processing' | 'shipped' | 'completed';

export interface ManufacturerOrder {
  id: string;
  equipment_id: string;
  user_id: string;
  amount: number;
  status: OrderStatus;
  payment_method: string;
  shipping_address: string;
  shipping_full_name: string;
  shipping_email: string;
  shipping_phone_number: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  equipment?: {
    id: string;
    name: string;
    manufacturer?: string;
    image_url?: string;
    price?: number;
  };
  customer?: {
    full_name: string;
    email: string;
    phone_number: string;
  };
}

export const useManufacturerOrders = () => {
  const [orders, setOrders] = useState<ManufacturerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get manufacturer's shop IDs
      const { data: shops, error: shopsError } = await supabase
        .from('manufacturer_shops')
        .select('id')
        .eq('manufacturer_id', user.id);

      if (shopsError) throw shopsError;

      const shopIds = shops?.map(shop => shop.id) || [];

      // Fetch orders for equipment in manufacturer's shops OR owned by manufacturer
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          equipment:equipment_id (
            id,
            name,
            manufacturer,
            image_url,
            price,
            shop_id,
            owner_id
          ),
          customer:customer_id (
            full_name,
            email,
            phone_number
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter orders to only include those for manufacturer's equipment
      const manufacturerOrders = data?.filter(order => {
        const equipment = order.equipment as any;
        if (!equipment) return false;
        
        // Include if equipment is in manufacturer's shop OR owned by manufacturer
        return shopIds.includes(equipment.shop_id) || equipment.owner_id === user.id;
      }) || [];

      setOrders(manufacturerOrders as ManufacturerOrder[]);
    } catch (error: any) {
      console.error('Error fetching manufacturer orders:', error);
      toast({
        title: 'Error fetching orders',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderId: string, 
    newStatus: OrderStatus, 
    declineReason?: string
  ) => {
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (declineReason) {
        updateData.notes = declineReason;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      // If accepting order, reduce stock (optional - implement if needed)
      if (newStatus === 'accepted') {
        // TODO: Implement stock reduction logic
      }

      toast({
        title: 'Order updated',
        description: `Order status changed to ${newStatus}`,
      });

      // Refresh orders
      await fetchOrders();

      return { success: true };
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error updating order',
        description: error.message,
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('manufacturer-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    orders,
    loading,
    updateOrderStatus,
    refetch: fetchOrders,
  };
};
