import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useNotificationSystem = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  // Function to create notifications for users
  const createNotification = async (
    userId: string,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    actionUrl?: string
  ) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type,
          action_url: actionUrl,
          read: false
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  // Function to notify all admins
  const notifyAllAdmins = async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    actionUrl?: string
  ) => {
    try {
      // Get all admin users
      const { data: adminProfiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin');

      if (adminProfiles && adminProfiles.length > 0) {
        const notifications = adminProfiles.map(admin => ({
          user_id: admin.id,
          title,
          message,
          type,
          action_url: actionUrl,
          read: false
        }));

        await supabase.from('notifications').insert(notifications);
      }
    } catch (error) {
      console.error('Error notifying admins:', error);
    }
  };

  // Listen for real-time changes that should trigger notifications
  useEffect(() => {
    if (!user) return;

    const channels: any[] = [];

    // Listen for new user signups (admin notifications)
    const profileChannel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          const newProfile = payload.new;
          // Only notify if it's a different user (not self-registration)
          if (newProfile.id !== user.id) {
            notifyAllAdmins(
              'New User Registered',
              `${newProfile.full_name || newProfile.email} has joined as ${newProfile.role}`,
              'info',
              `/admin?tab=users`
            );
          }
        }
      )
      .subscribe();
    channels.push(profileChannel);

    // Listen for new equipment (relevant to all users)
    const equipmentChannel = supabase
      .channel('equipment-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'equipment'
        },
        (payload) => {
          const equipment = payload.new;
          
          // Notify admins
          if (profile?.role === 'admin') {
            createNotification(
              user.id,
              'New Equipment Added',
              `${equipment.name} has been added to the system`,
              'info',
              `/equipment/${equipment.id}`
            );
          }
          
          // Notify hospitals about new equipment in their area/category
          if (profile?.role === 'hospital') {
            createNotification(
              user.id,
              'New Equipment Available',
              `${equipment.name} is now available for booking`,
              'info',
              `/equipment/${equipment.id}`
            );
          }
        }
      )
      .subscribe();
    channels.push(equipmentChannel);

    // Listen for new orders
    const ordersChannel = supabase
      .channel('order-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          const order = payload.new;
          
          // Notify admins about new orders
          notifyAllAdmins(
            'New Order Received',
            `New order for $${order.amount} has been placed`,
            'success',
            `/orders`
          );

          // If this is the user's order, notify them
          if (order.user_id === user.id) {
            createNotification(
              user.id,
              'Order Confirmed',
              `Your order for $${order.amount} has been confirmed`,
              'success',
              `/orders`
            );
          }
        }
      )
      .subscribe();
    channels.push(ordersChannel);

    // Listen for order status updates
    const orderUpdatesChannel = supabase
      .channel('order-status-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          const order = payload.new;
          const oldOrder = payload.old;
          
          // If status changed, notify the customer
          if (order.status !== oldOrder.status && order.user_id) {
            let message = `Your order status has been updated to: ${order.status}`;
            let type: 'info' | 'success' | 'warning' | 'error' = 'info';
            
            switch (order.status) {
              case 'confirmed':
                type = 'success';
                message = 'Your order has been confirmed and is being processed';
                break;
              case 'shipped':
                type = 'info';
                message = 'Your order has been shipped and is on its way';
                break;
              case 'delivered':
                type = 'success';
                message = 'Your order has been delivered successfully';
                break;
              case 'cancelled':
                type = 'error';
                message = 'Your order has been cancelled';
                break;
            }

            createNotification(
              order.user_id,
              'Order Status Update',
              message,
              type,
              `/orders`
            );
          }
        }
      )
      .subscribe();
    channels.push(orderUpdatesChannel);

    // Listen for new bookings
    const bookingsChannel = supabase
      .channel('booking-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          const booking = payload.new;
          
          // Notify admins
          notifyAllAdmins(
            'New Booking Created',
            `A new booking has been created for $${booking.price_paid}`,
            'info',
            `/admin?tab=bookings`
          );

          // If this is the user's booking, notify them
          if (booking.user_id === user.id) {
            createNotification(
              user.id,
              'Booking Confirmed',
              `Your booking has been confirmed`,
              'success',
              `/dashboard`
            );
          }
        }
      )
      .subscribe();
    channels.push(bookingsChannel);

    // Listen for booking status updates
    const bookingUpdatesChannel = supabase
      .channel('booking-status-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          const booking = payload.new;
          const oldBooking = payload.old;
          
          if (booking.status !== oldBooking.status && booking.user_id) {
            let message = `Your booking status has been updated to: ${booking.status}`;
            let type: 'info' | 'success' | 'warning' | 'error' = 'info';
            
            switch (booking.status) {
              case 'confirmed':
                type = 'success';
                message = 'Your booking has been confirmed';
                break;
              case 'cancelled':
                type = 'error';
                message = 'Your booking has been cancelled';
                break;
              case 'completed':
                type = 'success';
                message = 'Your booking has been completed successfully';
                break;
            }

            createNotification(
              booking.user_id,
              'Booking Status Update',
              message,
              type,
              `/dashboard`
            );
          }
        }
      )
      .subscribe();
    channels.push(bookingUpdatesChannel);

    // Listen for payment confirmations
    const transactionsChannel = supabase
      .channel('transaction-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions'
        },
        (payload) => {
          const transaction = payload.new;
          
          if (transaction.user_id === user.id && transaction.status === 'successful') {
            createNotification(
              user.id,
              'Payment Confirmed',
              `Your payment of $${transaction.amount} has been processed successfully`,
              'success',
              `/orders`
            );
          }
        }
      )
      .subscribe();
    channels.push(transactionsChannel);

    // Listen for support request updates
    const supportChannel = supabase
      .channel('support-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_requests'
        },
        (payload) => {
          const request = payload.new;
          
          // Notify admins of new support requests
          notifyAllAdmins(
            'New Support Request',
            `New ${request.priority} priority request: ${request.subject}`,
            request.priority === 'high' ? 'error' : 'warning',
            `/admin?tab=support`
          );
        }
      )
      .subscribe();
    channels.push(supportChannel);

    // Listen for support request status updates
    const supportUpdatesChannel = supabase
      .channel('support-status-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'support_requests'
        },
        (payload) => {
          const request = payload.new;
          const oldRequest = payload.old;
          
          // Notify user if their support request status changed
          if (request.status !== oldRequest.status && request.user_id === user.id) {
            let type: 'info' | 'success' | 'warning' | 'error' = 'info';
            let message = `Your support request status has been updated to: ${request.status}`;
            
            if (request.status === 'resolved') {
              type = 'success';
              message = 'Your support request has been resolved';
            }

            createNotification(
              request.user_id,
              'Support Request Update',
              message,
              type,
              `/support`
            );
          }
        }
      )
      .subscribe();
    channels.push(supportUpdatesChannel);

    // Listen for maintenance alerts
    const maintenanceChannel = supabase
      .channel('maintenance-notifications')
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
            // Notify admins and equipment owners
            notifyAllAdmins(
              'Maintenance Overdue',
              `Equipment maintenance is overdue`,
              'error',
              `/admin?tab=maintenance`
            );
            
            // If user is manufacturer/owner, notify them too
            if (profile?.role === 'manufacturer' || profile?.role === 'admin') {
              createNotification(
                user.id,
                'Maintenance Alert',
                `Equipment maintenance is overdue`,
                'error',
                `/equipment-management`
              );
            }
          }
        }
      )
      .subscribe();
    channels.push(maintenanceChannel);

    // Listen for new products (for hospitals and users)
    const productsChannel = supabase
      .channel('product-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          const product = payload.new;
          
          // Notify hospitals and general users about new products
          if (profile?.role === 'hospital') {
            createNotification(
              user.id,
              'New Product Available',
              `${product.name} is now available in the shop`,
              'info',
              `/shop`
            );
          }
        }
      )
      .subscribe();
    channels.push(productsChannel);

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [user, profile]);

  return { createNotification, notifyAllAdmins };
};