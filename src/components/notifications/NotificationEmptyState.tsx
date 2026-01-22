import React from 'react';
import { BellOff, Inbox, Search } from 'lucide-react';

interface NotificationEmptyStateProps {
  type: 'all' | 'unread' | 'read' | 'search';
  searchQuery?: string;
}

const NotificationEmptyState = ({ type, searchQuery }: NotificationEmptyStateProps) => {
  const getContent = () => {
    if (type === 'search' && searchQuery) {
      return {
        icon: <Search className="h-12 w-12 text-muted-foreground/50" />,
        title: 'No results found',
        description: `No notifications match "${searchQuery}"`,
      };
    }

    switch (type) {
      case 'unread':
        return {
          icon: <Inbox className="h-12 w-12 text-muted-foreground/50" />,
          title: 'All caught up!',
          description: 'You have no unread notifications',
        };
      case 'read':
        return {
          icon: <BellOff className="h-12 w-12 text-muted-foreground/50" />,
          title: 'No read notifications',
          description: 'Notifications you read will appear here',
        };
      default:
        return {
          icon: <BellOff className="h-12 w-12 text-muted-foreground/50" />,
          title: "You're all caught up!",
          description: 'No notifications to show right now',
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="p-4 rounded-full bg-muted/50 mb-4">
        {content.icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {content.title}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        {content.description}
      </p>
    </div>
  );
};

export default NotificationEmptyState;
