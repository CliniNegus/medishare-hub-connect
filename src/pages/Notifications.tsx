import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import NotificationHeader from '@/components/notifications/NotificationHeader';
import NotificationFilters from '@/components/notifications/NotificationFilters';
import NotificationGroup from '@/components/notifications/NotificationGroup';
import NotificationEmptyState from '@/components/notifications/NotificationEmptyState';
import NotificationSelectAll from '@/components/notifications/NotificationSelectAll';

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

const Notifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications((data || []) as Notification[]);
    } catch (error: any) {
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

  useEffect(() => {
    fetchNotifications();

    // Set up real-time subscription
    const channel = supabase
      .channel('notifications-page')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Apply filters
  useEffect(() => {
    let filtered = [...notifications];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        n => n.title.toLowerCase().includes(query) || n.message.toLowerCase().includes(query)
      );
    }

    // Tab filter
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (activeTab === 'read') {
      filtered = filtered.filter(n => n.read);
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchQuery, activeTab]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAsUnread = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: false })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: false } : n))
      );
    } catch (error) {
      console.error('Error marking as unread:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .in('id', Array.from(selectedIds));

      if (error) throw error;

      setNotifications(prev => prev.filter(n => !selectedIds.has(n.id)));
      setSelectedIds(new Set());
      toast({
        title: 'Success',
        description: `${selectedIds.size} notifications deleted`,
      });
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  };

  const markSelectedAsRead = async () => {
    if (selectedIds.size === 0) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', Array.from(selectedIds));

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => (selectedIds.has(n.id) ? { ...n, read: true } : n))
      );
      setSelectedIds(new Set());
      toast({
        title: 'Success',
        description: `${selectedIds.size} notifications marked as read`,
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const toggleSelect = (notificationId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const getEmptyStateType = (): 'all' | 'unread' | 'read' | 'search' => {
    if (searchQuery) return 'search';
    return activeTab as 'all' | 'unread' | 'read';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
        {/* Header */}
        <NotificationHeader
          unreadCount={unreadCount}
          loading={loading}
          onRefresh={fetchNotifications}
          onMarkAllAsRead={markAllAsRead}
        />

        {/* Filters */}
        <div className="mt-6">
          <NotificationFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={notifications.length}
            unreadCount={unreadCount}
            readCount={readCount}
            selectedCount={selectedIds.size}
            onMarkSelectedAsRead={markSelectedAsRead}
            onDeleteSelected={deleteSelected}
            onClearSelection={() => setSelectedIds(new Set())}
          />
        </div>

        {/* Content */}
        <div className="mt-6">
          {filteredNotifications.length === 0 ? (
            <div className="bg-card rounded-xl border border-border">
              <NotificationEmptyState 
                type={getEmptyStateType()} 
                searchQuery={searchQuery}
              />
            </div>
          ) : (
            <>
              {/* Select All */}
              <NotificationSelectAll
                isAllSelected={selectedIds.size === filteredNotifications.length && filteredNotifications.length > 0}
                isSomeSelected={selectedIds.size > 0 && selectedIds.size < filteredNotifications.length}
                totalCount={filteredNotifications.length}
                onSelectAll={selectAll}
              />

              {/* Grouped Notifications */}
              <NotificationGroup
                notifications={filteredNotifications}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onClick={handleNotificationClick}
                onMarkAsRead={markAsRead}
                onMarkAsUnread={markAsUnread}
                onDelete={deleteNotification}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
