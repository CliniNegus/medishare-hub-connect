
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, CheckCheck, Archive, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  action_url?: string | null;
  created_at: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    user_id: 'user-1',
    title: 'New Equipment Added',
    message: 'An MRI machine has been added to your inventory.',
    type: 'info',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '2',
    user_id: 'user-1',
    title: 'Lease Approved',
    message: 'Your lease request for the ultrasound machine has been approved.',
    type: 'success',
    read: false,
    action_url: '/leases/details',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    user_id: 'user-1',
    title: 'Maintenance Required',
    message: 'The X-ray machine requires scheduled maintenance.',
    type: 'warning',
    read: true,
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '4',
    user_id: 'user-1',
    title: 'Payment Overdue',
    message: 'Your payment for the CT scanner lease is overdue.',
    type: 'error',
    read: true,
    action_url: '/payments',
    created_at: new Date(Date.now() - 259200000).toISOString()
  }
];

const NotificationSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Simulate real-time notification with a timeout
      const timeout = setTimeout(() => {
        const newNotification: Notification = {
          id: `notification-${Date.now()}`,
          user_id: 'user-1',
          title: 'New Message Received',
          message: 'You have a new message from Hospital Administrator.',
          type: 'info',
          read: false,
          created_at: new Date().toISOString()
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(count => count + 1);
        
        toast({
          title: newNotification.title,
          description: newNotification.message,
          variant: 'default',
        });
      }, 10000);
      
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Use mock data instead of database query
      setTimeout(() => {
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notifications',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    
    try {
      // Update local state instead of database
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(count => Math.max(0, count - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification',
        variant: 'destructive',
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      // Update local state instead of database
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
      
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notifications',
        variant: 'destructive',
      });
    }
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'read':
        return notifications.filter(n => n.read);
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <Bell className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <Bell className="h-5 w-5 text-red-500" />;
      default:
        return <Mail className="h-5 w-5 text-blue-500" />;
    }
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Please sign in to view your notifications</CardDescription>
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
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 bg-red-600">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>
        <CardDescription>
          Stay updated with important events and messages
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="px-4 pt-2 border-b">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread" className="relative">
                Unread
                {unreadCount > 0 && (
                  <Badge className="ml-1 h-5 min-w-5 bg-red-600 absolute -top-2 -right-2 flex items-center justify-center text-[10px]">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full px-4">
              {loading ? (
                <div className="flex justify-center p-4">Loading notifications...</div>
              ) : getFilteredNotifications().length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                  <Bell className="h-12 w-12 text-gray-300 mb-2" />
                  <p>No notifications found</p>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  {getFilteredNotifications().map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded-lg border ${notification.read ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {format(new Date(notification.created_at), 'MMM d, yyyy h:mm a')}
                            </p>
                            {notification.action_url && (
                              <Button
                                variant="link"
                                className="p-0 h-auto text-red-600"
                                asChild
                              >
                                <a href={notification.action_url} target="_blank" rel="noopener noreferrer">
                                  View details
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-gray-900 h-8 px-2"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationSystem;
