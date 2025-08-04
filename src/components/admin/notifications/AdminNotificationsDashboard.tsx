import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Send, 
  Bell, 
  RefreshCw, 
  Calendar,
  Filter,
  Trash2,
  Edit,
  Users,
  Building2,
  Factory,
  TrendingUp,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';
import { supabase } from '@/integrations/supabase/client';

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent' | 'success';
}

const defaultTemplates: NotificationTemplate[] = [
  {
    id: 'maintenance',
    name: 'System Maintenance',
    title: 'Scheduled System Maintenance',
    message: 'We will be performing scheduled maintenance on [DATE] from [TIME]. Services may be temporarily unavailable.',
    type: 'warning'
  },
  {
    id: 'policy',
    name: 'Policy Update',
    title: 'Platform Policy Update',
    message: 'Our platform policies have been updated. Please review the changes in your account settings.',
    type: 'info'
  },
  {
    id: 'welcome',
    name: 'Welcome Message',
    title: 'Welcome to CliniBuilds',
    message: 'Thank you for joining our platform! Get started by completing your profile and exploring our features.',
    type: 'success'
  }
];

const AdminNotificationsDashboard = () => {
  const { toast } = useToast();
  const { 
    notifications, 
    loading, 
    sending, 
    fetchNotifications, 
    sendNotification, 
    deleteNotification 
  } = useNotifications();

  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'info' | 'warning' | 'urgent' | 'success'>('info');
  const [targetType, setTargetType] = useState('all_users');
  const [specificUserId, setSpecificUserId] = useState('');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Filter state
  const [filterType, setFilterType] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');

  // Users list for specific targeting
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load users for targeting
  useEffect(() => {
    if (targetType === 'user') {
      loadUsers();
    }
  }, [targetType]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = defaultTemplates.find(t => t.id === templateId);
    if (template) {
      setTitle(template.title);
      setMessage(template.message);
      setNotificationType(template.type);
      setSelectedTemplate(templateId);
    }
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in title and message',
        variant: 'destructive',
      });
      return;
    }

    if (targetType === 'user' && !specificUserId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a specific user',
        variant: 'destructive',
      });
      return;
    }

    try {
      await sendNotification(
        targetType,
        targetType.startsWith('all_') ? targetType.replace('all_', '') : targetType,
        specificUserId,
        title,
        message,
        notificationType,
        ''
      );

      // Reset form
      setTitle('');
      setMessage('');
      setNotificationType('info');
      setTargetType('all_users');
      setSpecificUserId('');
      setScheduleEnabled(false);
      setScheduledDate('');
      setSelectedTemplate('');

      toast({
        title: 'Success',
        description: 'Notification sent successfully',
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to send notification',
        variant: 'destructive',
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'urgent': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'success': return <Check className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTargetIcon = (target: string) => {
    if (target.includes('hospital')) return <Building2 className="h-4 w-4" />;
    if (target.includes('manufacturer')) return <Factory className="h-4 w-4" />;
    if (target.includes('investor')) return <TrendingUp className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filterType !== 'all' && notification.type !== filterType) return false;
    
    if (filterDateRange !== 'all') {
      const notificationDate = new Date(notification.created_at);
      const now = new Date();
      const daysDiff = (now.getTime() - notificationDate.getTime()) / (1000 * 3600 * 24);
      
      switch (filterDateRange) {
        case 'today':
          if (daysDiff > 1) return false;
          break;
        case 'week':
          if (daysDiff > 7) return false;
          break;
        case 'month':
          if (daysDiff > 30) return false;
          break;
      }
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#333333]">Notifications Dashboard</h1>
          <p className="text-gray-600">Send and manage system notifications to all user types</p>
        </div>
        <Button
          variant="outline"
          onClick={fetchNotifications}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">Send Notification</TabsTrigger>
          <TabsTrigger value="logs">Notification Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="h-5 w-5 mr-2 text-[#E02020]" />
                Send New Notification
              </CardTitle>
              <CardDescription>
                Create and send notifications to specific user types or individual users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Templates */}
              <div className="space-y-2">
                <Label>Quick Templates</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template or create custom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Custom Notification</SelectItem>
                    {defaultTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Notification title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Notification message"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notification Type</Label>
                    <Select value={notificationType} onValueChange={(value: any) => setNotificationType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Information</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <Select value={targetType} onValueChange={setTargetType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_users">All Users</SelectItem>
                        <SelectItem value="all_hospitals">All Hospitals</SelectItem>
                        <SelectItem value="all_manufacturers">All Manufacturers</SelectItem>
                        <SelectItem value="all_investors">All Investors</SelectItem>
                        <SelectItem value="all_admins">All Admins</SelectItem>
                        <SelectItem value="user">Specific User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {targetType === 'user' && (
                    <div className="space-y-2">
                      <Label>Select User</Label>
                      <Select value={specificUserId} onValueChange={setSpecificUserId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingUsers ? (
                            <SelectItem value="">Loading users...</SelectItem>
                          ) : (
                            users.map(user => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.full_name || user.email} ({user.role})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="schedule"
                        checked={scheduleEnabled}
                        onCheckedChange={setScheduleEnabled}
                      />
                      <Label htmlFor="schedule">Schedule for later</Label>
                    </div>

                    {scheduleEnabled && (
                      <div className="space-y-2">
                        <Label htmlFor="scheduledDate">Send Date & Time</Label>
                        <Input
                          id="scheduledDate"
                          type="datetime-local"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleSendNotification}
                    disabled={sending}
                    className="w-full bg-[#E02020] hover:bg-[#c01010]"
                  >
                    {sending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-[#E02020]" />
                    Notification Logs
                  </CardTitle>
                  <CardDescription>
                    View and manage all sent notifications
                  </CardDescription>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-gray-500 mt-2">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="text-gray-500 mt-2">No notifications found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(notification.type)}
                            <h3 className="font-medium text-[#333333]">{notification.title}</h3>
                            <Badge variant={notification.read ? 'secondary' : 'default'}>
                              {notification.read ? 'Read' : 'Unread'}
                            </Badge>
                            <Badge variant="outline">
                              {notification.type}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              Sent to: {notification.user_email || 'Multiple users'}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(notification.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotificationsDashboard;