
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, RefreshCw } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import MessageForm, { MessageFormData } from './messaging/MessageForm';
import MessageList from './messaging/MessageList';

const MessagingSystem = () => {
  const { user } = useAuth();
  const { messages, loading, sending, fetchMessages, sendMessage } = useMessaging();

  const handleSendMessage = async (formData: MessageFormData) => {
    await sendMessage(
      formData.recipientType,
      formData.recipientId,
      formData.recipientRole,
      formData.subject,
      formData.content,
      formData.messageType,
      formData.priority
    );
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>System Messaging</CardTitle>
          <CardDescription>Please sign in to access messaging system</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5 text-red-600" />
            <CardTitle>System Messaging</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMessages}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Send messages to users or user groups
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-2 overflow-hidden flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <MessageForm onSendMessage={handleSendMessage} sending={sending} />
          <MessageList messages={messages} loading={loading} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagingSystem;
