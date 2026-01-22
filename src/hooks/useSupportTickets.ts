import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useToast } from '@/hooks/use-toast';
import type { SupportRequest, SupportMessage, SupportCategory } from '@/types/support';

export function useSupportTickets() {
  const { user } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Fetch user's tickets
  const { data: tickets, isLoading: ticketsLoading, refetch: refetchTickets } = useQuery({
    queryKey: ['user-support-tickets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('support_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SupportRequest[];
    },
    enabled: !!user,
  });

  // Fetch messages for selected ticket
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['ticket-messages', selectedTicketId],
    queryFn: async () => {
      if (!selectedTicketId) return [];
      
      const { data, error } = await supabase
        .from('support_conversations')
        .select('*')
        .eq('support_request_id', selectedTicketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as SupportMessage[];
    },
    enabled: !!selectedTicketId,
  });

  // Submit new ticket
  const submitTicket = useMutation({
    mutationFn: async (data: {
      subject: string;
      message: string;
      category: SupportCategory;
      priority?: string;
      file_url?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const { data: ticket, error } = await supabase
        .from('support_requests')
        .insert({
          user_id: user.id,
          subject: data.subject,
          message: data.message,
          category: data.category,
          priority: data.priority || 'normal',
          status: 'open',
          account_type: profileData?.role || role,
          file_url: data.file_url,
        })
        .select()
        .single();

      if (error) throw error;
      return ticket;
    },
    onSuccess: () => {
      toast({
        title: 'Ticket Submitted',
        description: 'Your support ticket has been created. We\'ll respond soon!',
      });
      queryClient.invalidateQueries({ queryKey: ['user-support-tickets'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to submit ticket. Please try again.',
        variant: 'destructive',
      });
      console.error('Submit ticket error:', error);
    },
  });

  // Send follow-up message
  const sendMessage = useMutation({
    mutationFn: async (data: { ticketId: string; message: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: msg, error } = await supabase
        .from('support_conversations')
        .insert({
          support_request_id: data.ticketId,
          sender_id: user.id,
          sender_type: 'user',
          message: data.message,
        })
        .select()
        .single();

      if (error) throw error;
      return msg;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-messages', selectedTicketId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      console.error('Send message error:', error);
    },
  });

  const selectedTicket = tickets?.find(t => t.id === selectedTicketId) || null;

  return {
    tickets,
    ticketsLoading,
    selectedTicket,
    selectedTicketId,
    setSelectedTicketId,
    messages,
    messagesLoading,
    submitTicket,
    sendMessage,
    refetchTickets,
  };
}
