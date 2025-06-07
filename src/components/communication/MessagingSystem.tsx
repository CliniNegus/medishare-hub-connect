
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageCircle, Send, RefreshCw, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface SystemMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  recipient_role: string;
  subject: string;
  content: string;
  message_type: string;
  priority: string;
  status: string;
  read_at: string | null;
  created_at: string;
  sender_email?: string;
  recipient_email?: string;
}

const MessagingSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<SystemMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Form state
  const [recipientType, setRecipientType] = useState('role');
  const [recipientId, setRecipientId] = useState('');
  const [recipientRole, setRecipientRole] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [messageType, setMessageType] = useState('direct');
  const [priority, setPriority] = useState('normal');

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      const { data: messagesData, error } = await supabase
        .from('system_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch sender and recipient emails separately
      const formattedMessages = await Promise.all(
        (messagesData || []).map(async (msg) => {
          let senderEmail = 'Unknown';
          let recipientEmail = 'Role-based message';

          // Fetch sender email
          if (msg.sender_id) {
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', msg.sender_id)
              .single();
            if (senderProfile) {
              senderEmail = senderProfile.email;
            }
          }

          // Fetch recipient email if it's a direct message
          if (msg.recipient_id) {
            const { data: recipientProfile } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', msg.recipient_id)
              .single();
            if (recipientProfile) {
              recipientEmail = recipientProfile.email;
            }
          }

          return {
            ...msg,
            sender_email: senderEmail,
            recipient_email: recipientEmail
          };
        })
      );

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load system messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
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

    try {
      setSending(true);

      const { data, error } = await supabase.rpc('send_system_message', {
        recipient_id_param: recipientType === 'user' ? recipientId : null,
        recipient_role_param: recipientType === 'role' ? recipientRole : null,
        subject_param: subject,
        content_param: content,
        message_type_param: messageType,
        priority_param: priority
      });

      if (error) throw error;

      toast({
        title: 'Message Sent',
        description: 'System message has been sent successfully',
      });

      // Reset form
      setRecipientId('');
      setRecipientRole('');
      setSubject('');
      setContent('');
      setMessageType('direct');
      setPriority('normal');

      // Refresh messages
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>System Messaging</CardTitle>
          <CardDescription>Please sign in to access messaging system</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5 text-red-600" />
            <CardTitle>System Messaging</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMessages}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Send messages to users or user groups
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-2 overflow-hidden flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Send Message Form */}
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
              onClick={sendMessage}
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

          {/* Message History */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recent Messages</h3>
            <div className="border rounded-lg overflow-hidden h-[400px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="h-6 w-6 animate-spin text-red-600" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <MessageCircle className="h-12 w-12 text-gray-300 mb-2 mr-2" />
                  <p>No messages sent yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map(message => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium max-w-[150px] truncate">
                          {message.subject}
                        </TableCell>
                        <TableCell className="max-w-[100px] truncate">
                          {message.recipient_email || `All ${message.recipient_role}s`}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(message.created_at), 'MMM d, HH:mm')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagingSystem;
