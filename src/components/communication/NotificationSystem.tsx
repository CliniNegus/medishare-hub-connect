
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bell, Send, RefreshCw, Loader, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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

const NotificationSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Form state
  const [recipientType, setRecipientType] = useState('role');
  const [recipientRole, setRecipientRole] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [actionUrl, setActionUrl] = useState('');

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

  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in title and message',
        variant: 'destructive',
      });
      return;
    }

    if (recipientType === 'user' && !recipientId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a recipient',
        variant: 'destructive',
      });
      return;
    }

    if (recipientType === 'role' && !recipientRole) {
      toast({
        title: 'Validation Error',
        description: 'Please select a recipient role',
        variant: 'destructive',
      });
      return;
    }

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
        await sendToUser(recipientId);
      } else {
        // Send to role
        await sendToRole(recipientRole);
      }

      toast({
        title: 'Notification Sent',
        description: 'Notification has been sent successfully',
      });

      // Reset form
      setTitle('');
      setMessage('');
      setNotificationType('info');
      setActionUrl('');
      setRecipientId('');

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

  const sendToUser = async (userId: string) => {
    const notification = {
      user_id: userId,
      title,
      message,
      type: notificationType,
      action_url: actionUrl || null
    };

    const { error } = await supabase
      .from('notifications')
      .insert([notification]);

    if (error) throw error;
  };

  const sendToRole = async (role: string) => {
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
        type: notificationType,
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Notification System</CardTitle>
          <CardDescription>Please sign in to access notification system</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-red-600" />
            <CardTitle>Notification System</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNotifications}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Send and manage system notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-2 overflow-hidden flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Create Notification Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Create Notification</h3>
            
            <div className="space-y-2">
              <Label>Recipient Type</Label>
              <Select value={recipientType} onValueChange={setRecipientType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="role">Send to Role</SelectItem>
                  <SelectItem value="user">Send to Specific User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {recipientType === 'role' && (
              <div className="space-y-2">
                <Label>Recipient Role</Label>
                <Select value={recipientRole} onValueChange={setRecipientRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospitals</SelectItem>
                    <SelectItem value="manufacturer">Manufacturers</SelectItem>
                    <SelectItem value="investor">Investors</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Notification Type</Label>
              <Select value={notificationType} onValueChange={setNotificationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter notification title"
                disabled={sending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Notification Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Enter your notification message..."
                rows={3}
                disabled={sending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionUrl">Action URL (Optional)</Label>
              <Input
                id="actionUrl"
                value={actionUrl}
                onChange={e => setActionUrl(e.target.value)}
                placeholder="e.g., /dashboard/orders"
                disabled={sending}
              />
            </div>

            <Button
              onClick={sendNotification}
              disabled={sending}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {sending ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </>
              )}
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recent Notifications</h3>
            <div className="border rounded-lg overflow-hidden h-[400px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="h-6 w-6 animate-spin text-red-600" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Bell className="h-12 w-12 text-gray-300 mb-2" />
                  <p>No notifications sent yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map(notification => (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium max-w-[120px] truncate">
                          {notification.title}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getTypeColor(notification.type)}`}>
                            {notification.type}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[100px] truncate">
                          {notification.user_email}
                        </TableCell>
                        <TableCell>
                          {format(new Date(notification.created_at), 'MMM d, HH:mm')}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSystem;
