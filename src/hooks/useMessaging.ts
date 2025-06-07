
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export function useMessaging() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<SystemMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

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

  const sendMessage = async (
    recipientType: string,
    recipientId: string,
    recipientRole: string,
    subject: string,
    content: string,
    messageType: string,
    priority: string
  ) => {
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

  return {
    messages,
    loading,
    sending,
    fetchMessages,
    sendMessage
  };
}
