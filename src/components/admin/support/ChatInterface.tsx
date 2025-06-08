
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

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

interface ChatInterfaceProps {
  selectedRequest: SupportRequestWithProfile | null;
  messages: SupportMessage[];
  setMessages: React.Dispatch<React.SetStateAction<SupportMessage[]>>;
  onResolveRequest: () => void;
  refetch: () => void;
}

export function ChatInterface({ 
  selectedRequest, 
  messages, 
  setMessages, 
  onResolveRequest,
  refetch 
}: ChatInterfaceProps) {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!selectedRequest || !newMessage.trim()) return;

    try {
      setSending(true);

      const { data, error } = await supabase
        .from('support_conversations')
        .insert({
          support_request_id: selectedRequest.id,
          sender_id: (await supabase.auth.getUser()).data.user?.id,
          sender_type: 'admin',
          message: newMessage.trim()
        })
        .select()
        .single();

      if (error) throw error;

      const typedMessage: SupportMessage = {
        ...data,
        sender_type: data.sender_type as 'user' | 'admin'
      };
      
      setMessages(prev => [...prev, typedMessage]);
      setNewMessage('');

      // Update request status to in_progress if it was open
      if (selectedRequest.status === 'open') {
        await supabase
          .from('support_requests')
          .update({ status: 'in_progress' })
          .eq('id', selectedRequest.id);

        refetch();
      }

      toast({
        title: 'Message sent',
        description: 'Your response has been sent to the user.',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {selectedRequest ? `Chat: ${selectedRequest.subject}` : 'Select a request'}
          </span>
          {selectedRequest && selectedRequest.status !== 'resolved' && (
            <Button
              onClick={onResolveRequest}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Mark Resolved
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
        {!selectedRequest ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a support request to view the conversation</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 mb-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  <p>No messages in this conversation yet</p>
                </div>
              ) : (
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
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-xs font-medium mb-1">
                          {msg.sender_type === 'admin' ? 'Admin' : selectedRequest.profiles?.full_name || 'User'}
                        </p>
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.sender_type === 'admin' ? 'text-red-100' : 'text-gray-500'}`}>
                          {format(new Date(msg.created_at), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            
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
                disabled={sending || selectedRequest.status === 'resolved'}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending || selectedRequest.status === 'resolved'}
                className="bg-[#E02020] hover:bg-red-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
