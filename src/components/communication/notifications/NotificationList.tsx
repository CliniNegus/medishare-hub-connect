
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Bell, Loader, Trash2 } from 'lucide-react';
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

interface NotificationListProps {
  notifications: NotificationRecord[];
  loading: boolean;
  onDeleteNotification: (id: string) => Promise<void>;
}

const NotificationList = ({ notifications, loading, onDeleteNotification }: NotificationListProps) => {
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

  return (
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
                      onClick={() => onDeleteNotification(notification.id)}
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
  );
};

export default NotificationList;
