
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, User, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SupportRequest } from '@/types/support';

interface SupportConversationProps {
  request: SupportRequest;
  onBack: () => void;
  onUpdate: () => void;
}

interface Conversation {
  id: string;
  message: string;
  sender_type: 'user' | 'admin';
  created_at: string;
  sender_id: string;
}

const SupportConversation: React.FC<SupportConversationProps> = ({ 
  request, 
  onBack, 
  onUpdate 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');

  const { data: conversations } = useQuery({
    queryKey: ['supportConversations', request.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_conversations')
        .select('*')
        .eq('support_request_id', request.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Conversation[];
    }
  });

  const addMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('support_conversations')
        .insert({
          support_request_id: request.id,
          sender_id: user.id,
          sender_type: 'user',
          message
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['supportConversations', request.id] });
      onUpdate();
      toast({
        title: "Message sent",
        description: "Your message has been added to the conversation.",
      });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    addMessageMutation.mutate(newMessage);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#333333]">{request.subject}</h1>
          <div className="flex gap-2 mt-2">
            <Badge className={getStatusColor(request.status)}>
              {request.status?.replace('_', ' ')}
            </Badge>
            <Badge className={getPriorityColor(request.priority)}>
              {request.priority?.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Original Request</CardTitle>
          <div className="text-sm text-gray-500">
            {new Date(request.created_at).toLocaleString()}
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{request.message}</p>
        </CardContent>
      </Card>

      {conversations && conversations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex gap-3 ${
                  conversation.sender_type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    conversation.sender_type === 'user'
                      ? 'bg-[#E02020] text-white ml-auto'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {conversation.sender_type === 'admin' ? (
                      <Shield className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="text-xs opacity-75">
                      {conversation.sender_type === 'admin' ? 'Support Team' : 'You'}
                    </span>
                    <span className="text-xs opacity-50">
                      {new Date(conversation.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{conversation.message}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {request.status !== 'closed' && request.status !== 'resolved' && (
        <Card>
          <CardHeader>
            <CardTitle>Add Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || addMessageMutation.isPending}
                className="bg-[#E02020] hover:bg-[#c01c1c]"
              >
                {addMessageMutation.isPending ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupportConversation;
