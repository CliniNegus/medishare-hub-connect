
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageFormProps {
  onSendMessage: (formData: MessageFormData) => Promise<void>;
  sending: boolean;
}

export interface MessageFormData {
  recipientType: string;
  recipientId: string;
  recipientRole: string;
  subject: string;
  content: string;
  messageType: string;
  priority: string;
}

const MessageForm = ({ onSendMessage, sending }: MessageFormProps) => {
  const { toast } = useToast();
  const [recipientType, setRecipientType] = useState('role');
  const [recipientId, setRecipientId] = useState('');
  const [recipientRole, setRecipientRole] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [messageType, setMessageType] = useState('direct');
  const [priority, setPriority] = useState('normal');

  const handleSubmit = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in subject and content',
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

    await onSendMessage({
      recipientType,
      recipientId,
      recipientRole,
      subject,
      content,
      messageType,
      priority
    });

    // Reset form
    setRecipientId('');
    setRecipientRole('');
    setSubject('');
    setContent('');
    setMessageType('direct');
    setPriority('normal');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Send New Message</h3>
      
      <div className="space-y-2">
        <Label>Recipient Type</Label>
        <Select value={recipientType} onValueChange={setRecipientType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="role">Send to Role</SelectItem>
            <SelectItem value="user">Send to Specific User</SelectItem>
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

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label>Message Type</Label>
          <Select value={messageType} onValueChange={setMessageType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">Direct</SelectItem>
              <SelectItem value="broadcast">Broadcast</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Enter message subject"
          disabled={sending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Message Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Enter your message..."
          rows={6}
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
            Send Message
          </>
        )}
      </Button>
    </div>
  );
};

export default MessageForm;
