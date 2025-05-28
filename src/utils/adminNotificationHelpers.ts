
import { supabase } from '@/integrations/supabase/client';

export const generateInitialAdminNotifications = async (adminUserId: string) => {
  try {
    // Get recent equipment added (last 7 days)
    const { data: recentEquipment } = await supabase
      .from('equipment')
      .select('*')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(5);

    // Get pending orders
    const { data: pendingOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get open support requests
    const { data: openSupport } = await supabase
      .from('support_requests')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get overdue maintenance
    const { data: overdueMaintenance } = await supabase
      .from('maintenance')
      .select('*')
      .eq('status', 'overdue')
      .order('scheduled_date', { ascending: true })
      .limit(5);

    const notifications = [];

    // Create notifications for recent equipment
    recentEquipment?.forEach(equipment => {
      notifications.push({
        user_id: adminUserId,
        title: 'Equipment Added',
        message: `${equipment.name} was added to the system`,
        type: 'info',
        action_url: `/equipment/${equipment.id}`,
        read: false
      });
    });

    // Create notifications for pending orders
    pendingOrders?.forEach(order => {
      notifications.push({
        user_id: adminUserId,
        title: 'Pending Order',
        message: `Order #${order.id.substring(0, 8)} requires attention ($${order.amount})`,
        type: 'warning',
        action_url: `/orders`,
        read: false
      });
    });

    // Create notifications for open support requests
    openSupport?.forEach(support => {
      notifications.push({
        user_id: adminUserId,
        title: 'Support Request',
        message: `${support.subject} - Priority: ${support.priority}`,
        type: 'warning',
        action_url: `/admin?tab=support`,
        read: false
      });
    });

    // Create notifications for overdue maintenance
    overdueMaintenance?.forEach(maintenance => {
      notifications.push({
        user_id: adminUserId,
        title: 'Overdue Maintenance',
        message: `Maintenance task is overdue`,
        type: 'error',
        action_url: `/admin?tab=maintenance`,
        read: false
      });
    });

    // Insert all notifications
    if (notifications.length > 0) {
      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) throw error;
    }

    return notifications.length;
  } catch (error) {
    console.error('Error generating initial admin notifications:', error);
    return 0;
  }
};

export const markAdminNotificationAsRead = async (notificationId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, updated_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

export const getAdminNotificationStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('read')
      .eq('user_id', userId);

    if (error) throw error;

    const total = data?.length || 0;
    const unread = data?.filter(n => !n.read).length || 0;

    return { total, unread };
  } catch (error) {
    console.error('Error getting notification stats:', error);
    return { total: 0, unread: 0 };
  }
};
