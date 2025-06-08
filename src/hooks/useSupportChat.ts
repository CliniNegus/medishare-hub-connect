
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SupportMessage {
  id: string;
  support_request_id: string;
  sender_id: string;
  sender_type: 'user' | 'admin';
  message: string;
  created_at: string;
  updated_at: string;
}

interface SupportRequest {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

export function useSupportChat() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [currentRequest, setCurrentRequest] = useState<SupportRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Create or get existing support request
  const initializeChat = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Check for existing open support request
      const { data: existingRequest, error: requestError } = await supabase
        .from('support_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (requestError && requestError.code !== 'PGRST116') {
        throw requestError;
      }

      if (existingRequest) {
        const typedRequest: SupportRequest = {
          ...existingRequest,
          status: existingRequest.status as 'open' | 'in_progress' | 'resolved' | 'closed',
          priority: existingRequest.priority as 'low' | 'normal' | 'high' | 'urgent'
        };
        setCurrentRequest(typedRequest);
        await fetchMessages(existingRequest.id);
      } else {
        // Create new support request
        const { data: newRequest, error: createError } = await supabase
          .from('support_requests')
          .insert({
            user_id: user.id,
            subject: 'General Support',
            message: 'Chat support session started',
            status: 'open',
            priority: 'normal'
          })
          .select()
          .single();

        if (createError) throw createError;

        const typedRequest: SupportRequest = {
          ...newRequest,
          status: newRequest.status as 'open' | 'in_progress' | 'resolved' | 'closed',
          priority: newRequest.priority as 'low' | 'normal' | 'high' | 'urgent'
        };
        setCurrentRequest(typedRequest);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize support chat',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Fetch messages for current support request
  const fetchMessages = useCallback(async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_conversations')
        .select('*')
        .eq('support_request_id', requestId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const typedMessages: SupportMessage[] = (data || []).map(msg => ({
        ...msg,
        sender_type: msg.sender_type as 'user' | 'admin'
      }));

      setMessages(typedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat messages',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Send a new message
  const sendMessage = useCallback(async (messageText: string) => {
    if (!user || !currentRequest || !messageText.trim()) return;

    try {
      setSending(true);

      const { data, error } = await supabase
        .from('support_conversations')
        .insert({
          support_request_id: currentRequest.id,
          sender_id: user.id,
          sender_type: 'user',
          message: messageText.trim()
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state immediately with properly typed message
      const typedMessage: SupportMessage = {
        ...data,
        sender_type: data.sender_type as 'user' | 'admin'
      };
      setMessages(prev => [...prev, typedMessage]);

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSending(false);
    }
  }, [user, currentRequest, toast]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!currentRequest) return;

    const channel = supabase
      .channel(`support-chat-${currentRequest.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_conversations',
          filter: `support_request_id=eq.${currentRequest.id}`
        },
        (payload) => {
          const newMessage = payload.new as any;
          // Only add message if it's not from the current user (to avoid duplicates)
          if (newMessage.sender_id !== user?.id) {
            const typedMessage: SupportMessage = {
              ...newMessage,
              sender_type: newMessage.sender_type as 'user' | 'admin'
            };
            setMessages(prev => [...prev, typedMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentRequest, user]);

  // Initialize chat when component mounts
  useEffect(() => {
    if (user) {
      initializeChat();
    }
  }, [user, initializeChat]);

  return {
    messages,
    currentRequest,
    loading,
    sending,
    sendMessage,
    initializeChat
  };
}
