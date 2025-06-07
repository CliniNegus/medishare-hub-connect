
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  user_id: string;
  read: boolean;
  user_email?: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch user emails separately
      const formattedNotifications = await Promise.all(
        (data || []).map(async (notification) => {
          let userEmail = 'Unknown';

          if (notification.user_id) {
            const { data: userProfile } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', notification.user_id)
              .single();
            if (userProfile) {
              userEmail = userProfile.email;
            }
          }

          return {
            ...notification,
            user_email: userEmail
          };
        })
      );

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (
    recipientType: string,
    recipientRole: string,
    recipientId: string,
    title: string,
    message: string,
    notificationType: string,
    actionUrl: string
  ) => {
    try {
      setSending(true);

      // Log audit event
      await supabase.rpc('log_audit_event', {
        action_param: 'SEND_NOTIFICATION',
        resource_type_param: 'notification',
        resource_id_param: null,
        new_values_param: JSON.stringify({
          title,
          message,
          type: notificationType,
          recipient_type: recipientType,
          recipient: recipientType === 'user' ? recipientId : recipientRole
        })
      });

      if (recipientType === 'user') {
        // Send to specific user
        await sendToUser(recipientId, title, message, notificationType, actionUrl);
      } else {
        // Send to role
        await sendToRole(recipientRole, title, message, notificationType, actionUrl);
      }

      toast({
        title: 'Notification Sent',
        description: 'Notification has been sent successfully',
      });

      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to send notification',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const sendToUser = async (userId: string, title: string, message: string, type: string, actionUrl: string) => {
    const notification = {
      user_id: userId,
      title,
      message,
      type,
      action_url: actionUrl || null
    };

    const { error } = await supabase
      .from('notifications')
      .insert([notification]);

    if (error) throw error;
  };

  const sendToRole = async (role: string, title: string, message: string, type: string, actionUrl: string) => {
    // Get users with selected role
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', role);

    if (error) throw error;

    // Send notification to each user
    if (users && users.length > 0) {
      const notifications = users.map(u => ({
        user_id: u.id,
        title,
        message,
        type,
        action_url: actionUrl || null
      }));

      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (insertError) throw insertError;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Notification deleted successfully',
      });

      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      });
    }
  };

  return {
    notifications,
    loading,
    sending,
    fetchNotifications,
    sendNotification,
    deleteNotification
  };
}
