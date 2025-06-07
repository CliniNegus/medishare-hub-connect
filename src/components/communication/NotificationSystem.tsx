
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, RefreshCw } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationForm, { NotificationFormData } from './notifications/NotificationForm';
import NotificationList from './notifications/NotificationList';

const NotificationSystem = () => {
  const { user } = useAuth();
  const { 
    notifications, 
    loading, 
    sending, 
    fetchNotifications, 
    sendNotification, 
    deleteNotification 
  } = useNotifications();

  const handleSendNotification = async (formData: NotificationFormData) => {
    await sendNotification(
      formData.recipientType,
      formData.recipientRole,
      formData.recipientId,
      formData.title,
      formData.message,
      formData.notificationType,
      formData.actionUrl
    );
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
          <NotificationForm onSendNotification={handleSendNotification} sending={sending} />
          <NotificationList 
            notifications={notifications} 
            loading={loading} 
            onDeleteNotification={deleteNotification} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSystem;
