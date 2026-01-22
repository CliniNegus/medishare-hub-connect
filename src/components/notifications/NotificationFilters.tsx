import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Trash2, CheckCheck, X } from 'lucide-react';

interface NotificationFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  unreadCount: number;
  readCount: number;
  selectedCount: number;
  onMarkSelectedAsRead: () => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

const NotificationFilters = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  totalCount,
  unreadCount,
  readCount,
  selectedCount,
  onMarkSelectedAsRead,
  onDeleteSelected,
  onClearSelection,
}: NotificationFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full sm:w-auto">
          <TabsList className="h-10 p-1 bg-muted/50 w-full sm:w-auto grid grid-cols-3 sm:flex">
            <TabsTrigger 
              value="all" 
              className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              All
              <span className="ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                {totalCount}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="unread"
              className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-1.5 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="read"
              className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Read
              <span className="ml-1.5 text-xs text-muted-foreground">
                {readCount}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 bg-background border-border focus-visible:ring-primary/20"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSearchChange('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between gap-3 p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
          <span className="text-sm font-medium text-foreground">
            {selectedCount} selected
          </span>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMarkSelectedAsRead}
              className="h-8 text-xs hover:bg-primary/10"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
              Mark read
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDeleteSelected} 
              className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearSelection}
              className="h-8 text-xs hover:bg-muted"
            >
              <X className="h-3.5 w-3.5 mr-1.5" />
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationFilters;
