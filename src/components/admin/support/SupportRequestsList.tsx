
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, User, Clock } from 'lucide-react';
import { format } from 'date-fns';

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

interface SupportRequestsListProps {
  requests: SupportRequestWithProfile[] | undefined;
  selectedRequest: SupportRequestWithProfile | null;
  onSelectRequest: (request: SupportRequestWithProfile) => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

export function SupportRequestsList({ 
  requests, 
  selectedRequest, 
  onSelectRequest, 
  getStatusColor, 
  getPriorityColor 
}: SupportRequestsListProps) {
  return (
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
                  onClick={() => onSelectRequest(request)}
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
  );
}
