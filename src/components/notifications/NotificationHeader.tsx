import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, RefreshCw, CheckCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationHeaderProps {
  unreadCount: number;
  loading: boolean;
  onRefresh: () => void;
  onMarkAllAsRead: () => void;
}

const NotificationHeader = ({
  unreadCount,
  loading,
  onRefresh,
  onMarkAllAsRead,
}: NotificationHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="text-muted-foreground hover:text-foreground -ml-2 h-9"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {unreadCount > 0 
                ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up!'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="h-9 border-border hover:bg-muted"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
              className="h-9 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationHeader;
