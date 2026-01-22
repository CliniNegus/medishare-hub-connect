import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUPPORT_STATUSES, SUPPORT_CATEGORIES, SupportStatus, SupportRequestWithProfile, SupportMessage } from '@/types/support';
import { MessageCircle, Send, User, Clock, Paperclip, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { AdminSupportTicketsState } from '@/hooks/useAdminSupportTickets';

type AdminChatInterfaceProps = Pick<
  AdminSupportTicketsState,
  'selectedTicket' | 'messages' | 'messagesLoading' | 'sendMessage' | 'updateStatus'
>;

export function AdminChatInterface({
  selectedTicket,
  messages,
  messagesLoading,
  sendMessage,
  updateStatus,
}: AdminChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!selectedTicket) {
    return (
      <Card className="flex flex-col h-full">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Select a ticket to view conversation</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  const handleStatusChange = (newStatus: SupportStatus) => {
    updateStatus.mutate({
      ticketId: selectedTicket.id,
      status: newStatus,
    });
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{selectedTicket.subject}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="h-4 w-4" />
                {selectedTicket.profiles?.full_name || selectedTicket.profiles?.email || 'Unknown User'}
              </div>
              <Badge className={`${statusInfo?.color}`}>
                {statusInfo?.label || selectedTicket.status}
              </Badge>
              {categoryInfo && (
                <Badge variant="outline">{categoryInfo.label}</Badge>
              )}
              {selectedTicket.account_type && (
                <Badge variant="secondary" className="capitalize">
                  {selectedTicket.account_type}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {format(new Date(selectedTicket.created_at), 'MMM d, yyyy h:mm a')}
            </div>
          </div>
          
          <Select value={selectedTicket.status} onValueChange={(val) => handleStatusChange(val as SupportStatus)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORT_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
        {/* Original message */}
        <div className="p-4 bg-muted rounded-lg mb-4">
          <p className="text-xs font-medium mb-1 text-muted-foreground">Original Message:</p>
          <p className="text-sm whitespace-pre-wrap">{selectedTicket.message}</p>
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

        {/* Messages */}
        <ScrollArea className="flex-1 mb-4" ref={scrollRef}>
          {messagesLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading messages...
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender_type === 'admin'
                        ? 'bg-[#E02020] text-white'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-xs font-medium mb-1 opacity-75">
                      {msg.sender_type === 'admin' ? 'You' : selectedTicket.profiles?.full_name || 'User'}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.sender_type === 'admin' ? 'text-red-100' : 'opacity-60'}`}>
                      {format(new Date(msg.created_at), 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No messages in this conversation yet
            </div>
          )}
        </ScrollArea>

        {/* Reply box */}
        {isClosed ? (
          <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
            This ticket is closed. Reopen it to send messages.
          </div>
        ) : (
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your response..."
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
              className="bg-[#E02020] hover:bg-red-700 self-end"
            >
              {sendMessage.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
