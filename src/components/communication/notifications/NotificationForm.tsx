
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationFormProps {
  onSendNotification: (formData: NotificationFormData) => Promise<void>;
  sending: boolean;
}

export interface NotificationFormData {
  recipientType: string;
  recipientRole: string;
  recipientId: string;
  title: string;
  message: string;
  notificationType: string;
  actionUrl: string;
}

const NotificationForm = ({ onSendNotification, sending }: NotificationFormProps) => {
  const { toast } = useToast();
  const [recipientType, setRecipientType] = useState('role');
  const [recipientRole, setRecipientRole] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [actionUrl, setActionUrl] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in title and message',
        variant: 'destructive',
      });
      return;
    }

    if (recipientType === 'user' && !recipientId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a recipient',
        variant: 'destructive',
      });
      return;
    }

    if (recipientType === 'role' && !recipientRole) {
      toast({
        title: 'Validation Error',
        description: 'Please select a recipient role',
        variant: 'destructive',
      });
      return;
    }

    await onSendNotification({
      recipientType,
      recipientRole,
      recipientId,
      title,
      message,
      notificationType,
      actionUrl
    });

    // Reset form
    setTitle('');
    setMessage('');
    setNotificationType('info');
    setActionUrl('');
    setRecipientId('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Create Notification</h3>
      
      <div className="space-y-2">
        <Label>Recipient Type</Label>
        <Select value={recipientType} onValueChange={setRecipientType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="role">Send to Role</SelectItem>
            <SelectItem value="user">Send to Specific User</SelectItem>
            <SelectItem value="all_users">Send to All Users</SelectItem>
            <SelectItem value="all_admins">Send to All Admins</SelectItem>
            <SelectItem value="all_hospitals">Send to All Hospitals</SelectItem>
            <SelectItem value="all_manufacturers">Send to All Manufacturers</SelectItem>
            <SelectItem value="all_investors">Send to All Investors</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {recipientType === 'role' && (
        <div className="space-y-2">
          <Label>Recipient Role</Label>
          <Select value={recipientRole} onValueChange={setRecipientRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hospital">Hospitals</SelectItem>
              <SelectItem value="manufacturer">Manufacturers</SelectItem>
              <SelectItem value="investor">Investors</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label>Notification Type</Label>
        <Select value={notificationType} onValueChange={setNotificationType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Information</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Notification Title</Label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter notification title"
          disabled={sending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Notification Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Enter your notification message..."
          rows={3}
          disabled={sending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="actionUrl">Action URL (Optional)</Label>
        <Input
          id="actionUrl"
          value={actionUrl}
          onChange={e => setActionUrl(e.target.value)}
          placeholder="e.g., /dashboard/orders"
          disabled={sending}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={sending}
        className="w-full bg-red-600 hover:bg-red-700"
      >
        {sending ? (
          <>
            <Loader className="h-4 w-4 mr-2 animate-spin" />
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
  );
};

export default NotificationForm;
