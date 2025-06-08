
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SupportMessage {
  id: string;
  support_request_id: string;
  sender_id: string;
  sender_type: 'user' | 'admin';
  message: string;
  created_at: string;
}

interface SupportRequestWithProfile {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  profiles: {
    email: string;
    full_name: string;
  } | null;
}

export function useSupportRequests() {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<SupportRequestWithProfile | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);

  const { data: requests, refetch } = useQuery({
    queryKey: ['supportRequests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_requests')
        .select(`
          *,
          profiles:user_id(email, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type the data properly
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'open' | 'in_progress' | 'resolved' | 'closed',
        priority: item.priority as 'low' | 'normal' | 'high' | 'urgent',
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      })) as SupportRequestWithProfile[];
    }
  });

  const fetchMessages = async (requestId: string) => {
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
        description: 'Failed to load conversation messages',
        variant: 'destructive',
      });
    }
  };

  const handleSelectRequest = (request: SupportRequestWithProfile) => {
    setSelectedRequest(request);
    fetchMessages(request.id);
  };

  const handleResolveRequest = async () => {
    if (!selectedRequest) return;

    try {
      const { error } = await supabase
        .from('support_requests')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast({
        title: 'Request resolved',
        description: 'Support request has been marked as resolved.',
      });

      setSelectedRequest(prev => prev ? { ...prev, status: 'resolved' } : null);
      refetch();
    } catch (error) {
      console.error('Error resolving request:', error);
      toast({
        title: 'Error',
        description: 'Failed to resolve request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return {
    requests,
    selectedRequest,
    messages,
    setMessages,
    handleSelectRequest,
    handleResolveRequest,
    getStatusColor,
    getPriorityColor,
    refetch
  };
}
