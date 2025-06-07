
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useSystemMessaging() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sendingMessage, setSendingMessage] = useState(false);

  // Send system message
  const sendSystemMessage = async (
    recipientId: string | null,
    recipientRole: string | null,
    subject: string,
    content: string,
    messageType: string = 'direct',
    priority: string = 'normal'
  ) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You need to be signed in to perform this action',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setSendingMessage(true);
      
      const { data, error } = await supabase.rpc('send_system_message', {
        recipient_id_param: recipientId,
        recipient_role_param: recipientRole,
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

      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to send system message',
        variant: 'destructive',
      });
      return null;
    } finally {
      setSendingMessage(false);
    }
  };

  return {
    sendingMessage,
    sendSystemMessage
  };
}
