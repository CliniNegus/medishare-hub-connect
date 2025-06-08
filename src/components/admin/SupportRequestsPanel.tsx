import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, User, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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

export function SupportRequestsPanel() {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<SupportRequestWithProfile | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

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

        setSelectedRequest(prev => prev ? { ...prev, status: 'in_progress' } : null);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
      {/* Support Requests List */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5 text-[#E02020]" />
            Support Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4 overflow-hidden">
          <ScrollArea className="h-full">
            {requests?.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No support requests yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests?.map((request) => (
                  <Card 
                    key={request.id} 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedRequest?.id === request.id ? 'ring-2 ring-[#E02020]' : ''
                    }`}
                    onClick={() => handleSelectRequest(request)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm">{request.subject}</h3>
                        <div className="flex gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <User className="h-3 w-3 mr-1" />
                        {request.profiles?.full_name || request.profiles?.email || 'Unknown User'}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(request.created_at), 'MMM d, yyyy h:mm a')}
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{request.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {selectedRequest ? `Chat: ${selectedRequest.subject}` : 'Select a request'}
            </span>
            {selectedRequest && selectedRequest.status !== 'resolved' && (
              <Button
                onClick={handleResolveRequest}
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
    </div>
  );
}
