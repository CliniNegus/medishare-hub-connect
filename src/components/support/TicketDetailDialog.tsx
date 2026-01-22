import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSupportTickets } from '@/hooks/useSupportTickets';
import { SUPPORT_STATUSES, SUPPORT_CATEGORIES } from '@/types/support';
import { format } from 'date-fns';
import { Send, Clock, Paperclip, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface TicketDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TicketDetailDialog({ open, onOpenChange }: TicketDetailDialogProps) {
  const { selectedTicket, messages, messagesLoading, sendMessage, selectedTicketId } = useSupportTickets();
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Real-time subscription for messages
  const { refetch: refetchMessages } = useQuery({
    queryKey: ['ticket-messages', selectedTicketId],
    enabled: false,
  });

  useEffect(() => {
    if (!selectedTicketId) return;

    const channel = supabase
      .channel(`user-ticket-messages-${selectedTicketId}`)
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!selectedTicket) return null;

  const statusInfo = SUPPORT_STATUSES.find(s => s.value === selectedTicket.status);
  const categoryInfo = SUPPORT_CATEGORIES.find(c => c.value === selectedTicket.category);
  const isClosed = selectedTicket.status === 'closed';

  const handleSendMessage = () => {
    if (!newMessage.trim() || isClosed) return;
    
    sendMessage.mutate({
      ticketId: selectedTicket.id,
      message: newMessage.trim(),
    }, {
      onSuccess: () => setNewMessage(''),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-2">
            <span className="text-lg">{selectedTicket.subject}</span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={statusInfo?.color}>
                {statusInfo?.label || selectedTicket.status}
              </Badge>
              {categoryInfo && (
                <Badge variant="outline">{categoryInfo.label}</Badge>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(selectedTicket.created_at), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Original message */}
          <div className="p-4 bg-muted rounded-lg mb-4">
            <p className="text-sm text-foreground whitespace-pre-wrap">{selectedTicket.message}</p>
            {selectedTicket.file_url && (
              <a
                href={selectedTicket.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Paperclip className="h-4 w-4" />
                View Attachment
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Conversation */}
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            {messagesLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading messages...
              </div>
            ) : messages && messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender_type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-xs font-medium mb-1 opacity-75">
                        {msg.sender_type === 'user' ? 'You' : 'Support'}
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <p className="text-xs mt-1 opacity-60">
                        {format(new Date(msg.created_at), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No messages yet. Add a follow-up message below.
              </div>
            )}
          </ScrollArea>

          {/* Reply box */}
          {isClosed ? (
            <div className="mt-4 p-4 bg-muted rounded-lg text-center text-muted-foreground">
              This ticket is closed. You cannot send more messages.
            </div>
          ) : (
            <div className="mt-4 flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Add a follow-up message..."
                className="min-h-[80px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={sendMessage.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendMessage.isPending}
                className="self-end"
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
