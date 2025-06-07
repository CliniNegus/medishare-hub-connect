
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageCircle, Loader } from 'lucide-react';
import { format } from 'date-fns';

interface SystemMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  recipient_role: string;
  subject: string;
  content: string;
  message_type: string;
  priority: string;
  status: string;
  read_at: string | null;
  created_at: string;
  sender_email?: string;
  recipient_email?: string;
}

interface MessageListProps {
  messages: SystemMessage[];
  loading: boolean;
}

const MessageList = ({ messages, loading }: MessageListProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recent Messages</h3>
      <div className="border rounded-lg overflow-hidden h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="h-6 w-6 animate-spin text-red-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <MessageCircle className="h-12 w-12 text-gray-300 mb-2 mr-2" />
            <p>No messages sent yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map(message => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium max-w-[150px] truncate">
                    {message.subject}
                  </TableCell>
                  <TableCell className="max-w-[100px] truncate">
                    {message.recipient_email || `All ${message.recipient_role}s`}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(message.priority)}`}>
                      {message.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(message.created_at), 'MMM d, HH:mm')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default MessageList;
