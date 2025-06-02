
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import SupportRequestForm from './SupportRequestForm';
import SupportConversation from './SupportConversation';
import type { SupportRequest } from '@/types/support';

const UserSupportDashboard = () => {
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [showNewRequest, setShowNewRequest] = useState(false);

  const { data: requests, refetch } = useQuery({
    queryKey: ['userSupportRequests', user?.id],
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
    enabled: !!user
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertTriangle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
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

  if (selectedRequest) {
    return (
      <SupportConversation
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
        onUpdate={refetch}
      />
    );
  }

  if (showNewRequest) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#333333]">New Support Request</h1>
          <Button
            variant="outline"
            onClick={() => setShowNewRequest(false)}
          >
            Back to Requests
          </Button>
        </div>
        <SupportRequestForm 
          onRequestSubmitted={() => {
            setShowNewRequest(false);
            refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#333333]">Support Center</h1>
        <Button
          onClick={() => setShowNewRequest(true)}
          className="bg-[#E02020] hover:bg-[#c01c1c]"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {requests?.map((request) => (
            <Card key={request.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6" onClick={() => setSelectedRequest(request)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{request.subject}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status?.replace('_', ' ')}</span>
                      </Badge>
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priority?.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{request.message}</p>
                    <div className="text-sm text-gray-500">
                      Created: {new Date(request.created_at).toLocaleDateString()}
                      {request.resolved_at && (
                        <span className="ml-4">
                          Resolved: {new Date(request.resolved_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!requests || requests.length === 0) && (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No support requests yet</h3>
                <p className="text-gray-600 mb-4">
                  Have a question or need help? Submit your first support request.
                </p>
                <Button
                  onClick={() => setShowNewRequest(true)}
                  className="bg-[#E02020] hover:bg-[#c01c1c]"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Create Support Request
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {['open', 'in_progress', 'resolved'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {requests?.filter(req => req.status === status).map((request) => (
              <Card key={request.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6" onClick={() => setSelectedRequest(request)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{request.subject}</h3>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority?.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{request.message}</p>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default UserSupportDashboard;
