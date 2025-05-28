
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminNotifications = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  // Function to create admin notifications for system events
  const createAdminNotification = async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    actionUrl?: string
  ) => {
    if (!user || profile?.role !== 'admin') return;

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title,
          message,
          type,
          action_url: actionUrl,
          read: false
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating admin notification:', error);
    }
  };

  // Listen for real-time changes that should trigger admin notifications
  useEffect(() => {
    if (!user || profile?.role !== 'admin') return;

    // Listen for new equipment submissions
    const equipmentChannel = supabase
      .channel('admin-equipment-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'equipment'
        },
        (payload) => {
          const equipment = payload.new;
          createAdminNotification(
            'New Equipment Added',
            `${equipment.name} has been added to the system`,
            'info',
            `/equipment/${equipment.id}`
          );
          
          toast({
            title: "New Equipment",
            description: `${equipment.name} has been added to the system`,
          });
        }
      )
      .subscribe();

    // Listen for new bookings
    const bookingsChannel = supabase
      .channel('admin-booking-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          const booking = payload.new;
          createAdminNotification(
            'New Booking Created',
            `A new booking has been created with status: ${booking.status}`,
            'info',
            `/bookings/${booking.id}`
          );
        }
      )
      .subscribe();

    // Listen for new orders
    const ordersChannel = supabase
      .channel('admin-order-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          const order = payload.new;
          createAdminNotification(
            'New Order Received',
            `New order for $${order.amount} has been placed`,
            'success',
            `/orders/${order.id}`
          );
          
          toast({
            title: "New Order",
            description: `Order for $${order.amount} has been placed`,
          });
        }
      )
      .subscribe();

    // Listen for new support requests
    const supportChannel = supabase
      .channel('admin-support-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_requests'
        },
        (payload) => {
          const request = payload.new;
          createAdminNotification(
            'New Support Request',
            `Support ticket: ${request.subject}`,
            'warning',
            `/admin?tab=support`
          );
          
          toast({
            title: "New Support Request",
            description: request.subject,
            variant: "destructive",
          });
        }
      )
      .subscribe();

    // Listen for maintenance alerts
    const maintenanceChannel = supabase
      .channel('admin-maintenance-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'maintenance'
        },
        (payload) => {
          const maintenance = payload.new;
          if (maintenance.status === 'overdue') {
            createAdminNotification(
              'Maintenance Overdue',
              `Maintenance for equipment is overdue`,
              'error',
              `/admin?tab=maintenance`
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(equipmentChannel);
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(supportChannel);
      supabase.removeChannel(maintenanceChannel);
    };
  }, [user, profile]);

  return { createAdminNotification };
};
