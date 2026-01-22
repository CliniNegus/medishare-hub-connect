import React from 'react';
import { isToday, isThisWeek, parseISO } from 'date-fns';
import NotificationCard from './NotificationCard';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  action_url: string | null;
  created_at: string;
  updated_at: string;
}

interface NotificationGroupProps {
  notifications: Notification[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onClick: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationGroup = ({
  notifications,
  selectedIds,
  onToggleSelect,
  onClick,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
}: NotificationGroupProps) => {
  // Group notifications by time period
  const groupedNotifications = React.useMemo(() => {
    const today: Notification[] = [];
    const thisWeek: Notification[] = [];
    const earlier: Notification[] = [];

    notifications.forEach((notification) => {
      const date = parseISO(notification.created_at);
      if (isToday(date)) {
        today.push(notification);
      } else if (isThisWeek(date, { weekStartsOn: 1 })) {
        thisWeek.push(notification);
      } else {
        earlier.push(notification);
      }
    });

    return { today, thisWeek, earlier };
  }, [notifications]);

  const renderGroup = (title: string, items: Notification[]) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6 last:mb-0">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <h3 className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
            <span className="ml-2 text-primary font-bold">({items.length})</span>
          </h3>
        </div>
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          {items.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              isSelected={selectedIds.has(notification.id)}
              onToggleSelect={onToggleSelect}
              onClick={onClick}
              onMarkAsRead={onMarkAsRead}
              onMarkAsUnread={onMarkAsUnread}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {renderGroup('Today', groupedNotifications.today)}
      {renderGroup('This Week', groupedNotifications.thisWeek)}
      {renderGroup('Earlier', groupedNotifications.earlier)}
    </div>
  );
};

export default NotificationGroup;
