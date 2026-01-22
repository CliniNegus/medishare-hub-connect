import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Bell, 
  Check, 
  Trash2, 
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

interface NotificationCardProps {
  notification: Notification;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onClick: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationCard = ({
  notification,
  isSelected,
  onToggleSelect,
  onClick,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
}: NotificationCardProps) => {
  const getNotificationIcon = (type: string) => {
    const iconClasses = "h-5 w-5 flex-shrink-0";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClasses} text-green-500 dark:text-green-400`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClasses} text-amber-500 dark:text-amber-400`} />;
      case 'error':
        return <XCircle className={`${iconClasses} text-destructive`} />;
      default:
        return <Info className={`${iconClasses} text-blue-500 dark:text-blue-400`} />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div
      className={`
        group relative flex items-start gap-3 p-4 
        transition-all duration-200 ease-in-out
        hover:bg-muted/50 cursor-pointer
        border-b border-border last:border-b-0
        ${!notification.read ? 'bg-primary/5 dark:bg-primary/10' : 'bg-background'}
      `}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-md" />
      )}
      
      {/* Checkbox */}
      <div className="pt-0.5">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(notification.id)}
          onClick={(e) => e.stopPropagation()}
          className="border-muted-foreground/30"
        />
      </div>
      
      {/* Icon with type background */}
      <div className={`p-2 rounded-lg ${getTypeStyles(notification.type)} flex-shrink-0`}>
        {getNotificationIcon(notification.type)}
      </div>
      
      {/* Content */}
      <div 
        className="flex-1 min-w-0 space-y-1"
        onClick={() => onClick(notification)}
      >
        <div className="flex items-start justify-between gap-2">
          <h4 className={`text-sm leading-tight text-foreground ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
            {notification.title}
          </h4>
          <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
        
        {notification.action_url && (
          <span className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-1">
            <ExternalLink className="h-3 w-3" />
            View details
          </span>
        )}
      </div>
      
      {/* Actions - visible on hover on desktop, always visible on mobile */}
      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        {notification.read ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsUnread(notification.id);
            }}
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            title="Mark as unread"
          >
            <Bell className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            className="h-8 w-8 text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
            title="Mark as read"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationCard;
