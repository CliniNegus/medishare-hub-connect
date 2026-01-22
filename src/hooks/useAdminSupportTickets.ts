import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { SupportRequestWithProfile, SupportMessage, SupportStatus, SupportCategory } from '@/types/support';

export interface AdminFilters {
  status?: SupportStatus | 'all';
  category?: SupportCategory | 'all';
  accountType?: string | 'all';
}

export interface AdminSupportTicketsState {
  tickets: SupportRequestWithProfile[] | undefined;
  ticketsLoading: boolean;
  selectedTicket: SupportRequestWithProfile | null;
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;
  messages: SupportMessage[] | undefined;
  messagesLoading: boolean;
  filters: AdminFilters;
  setFilters: React.Dispatch<React.SetStateAction<AdminFilters>>;
  sendMessage: ReturnType<typeof useMutation<any, Error, { ticketId: string; message: string }>>;
  updateStatus: ReturnType<typeof useMutation<void, Error, { ticketId: string; status: SupportStatus }>>;
  refetchTickets: () => void;
}

export function useAdminSupportTickets(): AdminSupportTicketsState {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdminFilters>({
    status: 'all',
    category: 'all',
    accountType: 'all',
  });

  // Fetch all tickets with profile info
  const { data: tickets, isLoading: ticketsLoading, refetch: refetchTickets } = useQuery({
    queryKey: ['admin-support-tickets', filters],
    queryFn: async () => {
      let query = supabase
        .from('support_requests')
        .select(`
          *,
          profiles:user_id(email, full_name, role)
        `)
        .order('created_at', { ascending: false });

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.accountType && filters.accountType !== 'all') {
        query = query.eq('account_type', filters.accountType);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching support tickets:', error);
        throw error;
      }

      console.log('Fetched support tickets:', data);

      return (data || []).map(item => ({
        ...item,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
      })) as SupportRequestWithProfile[];
    },
  });

  // Fetch messages for selected ticket
  const { data: messages, isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['admin-ticket-messages', selectedTicketId],
    queryFn: async () => {
      if (!selectedTicketId) return [];

      const { data, error } = await supabase
        .from('support_conversations')
        .select('*')
        .eq('support_request_id', selectedTicketId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching ticket messages:', error);
        throw error;
      }
      return data as SupportMessage[];
    },
    enabled: !!selectedTicketId,
  });

  // Real-time subscription for messages
  useEffect(() => {
    if (!selectedTicketId) return;

    const channel = supabase
      .channel(`ticket-messages-${selectedTicketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_conversations',
          filter: `support_request_id=eq.${selectedTicketId}`,
        },
        () => {
          refetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedTicketId, refetchMessages]);

  // Send admin response
  const sendMessage = useMutation({
    mutationFn: async (data: { ticketId: string; message: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { data: msg, error } = await supabase
        .from('support_conversations')
        .insert({
          support_request_id: data.ticketId,
          sender_id: userData.user.id,
          sender_type: 'admin',
          message: data.message,
        })
        .select()
        .single();

      if (error) throw error;

      // Update ticket status to in_progress if it was open
      const ticket = tickets?.find(t => t.id === data.ticketId);
      if (ticket?.status === 'open') {
        await supabase
          .from('support_requests')
          .update({ status: 'in_progress' })
          .eq('id', data.ticketId);
      }

      return msg;
    },
    onSuccess: () => {
      toast({
        title: 'Response Sent',
        description: 'Your response has been sent to the user.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-ticket-messages', selectedTicketId] });
      queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to send response.',
        variant: 'destructive',
      });
      console.error('Send message error:', error);
    },
  });

  // Update ticket status
  const updateStatus = useMutation({
    mutationFn: async (data: { ticketId: string; status: SupportStatus }) => {
      const updateData: Record<string, unknown> = { status: data.status };
      if (data.status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('support_requests')
        .update(updateData)
        .eq('id', data.ticketId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      toast({
        title: 'Status Updated',
        description: `Ticket status changed to ${variables.status}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update status.',
        variant: 'destructive',
      });
      console.error('Update status error:', error);
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
    filters,
    setFilters,
    sendMessage,
    updateStatus,
    refetchTickets,
  };
}
