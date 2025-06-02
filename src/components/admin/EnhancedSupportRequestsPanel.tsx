
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Reply, Eye, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';
import type { SupportRequest } from '@/types/support';

interface EnhancedSupportRequest extends SupportRequest {
  profiles?: {
    email: string;
    full_name: string;
    role: string;
    organization: string;
  };
}

interface Conversation {
  id: string;
  message: string;
  sender_type: 'user' | 'admin';
  created_at: string;
  sender_id: string;
}

export function EnhancedSupportRequestsPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<EnhancedSupportRequest | null>(null);
  const [response, setResponse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data: requests, refetch } = useQuery({
    queryKey: ['adminSupportRequests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_requests')
        .select(`
          *,
          profiles:user_id(email, full_name, role, organization)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EnhancedSupportRequest[];
    }
  });

  const { data: conversations } = useQuery({
    queryKey: ['supportConversations', selectedRequest?.id],
    queryFn: async () => {
      if (!selectedRequest) return [];
      
      const { data, error } = await supabase
        .from('support_conversations')
        .select('*')
        .eq('support_request_id', selectedRequest.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Conversation[];
    },
    enabled: !!selectedRequest
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, adminResponse }: { id: string; status: string; adminResponse?: string }) => {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }
      
      if (adminResponse) {
        updateData.admin_response = adminResponse;
      }

      const { error } = await supabase
        .from('support_requests')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Request updated",
        description: "Support request status has been updated.",
      });
    }
  });

  const addConversationMutation = useMutation({
    mutationFn: async ({ requestId, message }: { requestId: string; message: string }) => {
      // Get current user (admin)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Admin not authenticated');

      const { error } = await supabase
        .from('support_conversations')
        .insert({
          support_request_id: requestId,
          sender_id: user.id,
          sender_type: 'admin',
          message
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setResponse('');
      queryClient.invalidateQueries({ queryKey: ['supportConversations', selectedRequest?.id] });
      refetch();
      toast({
        title: "Response sent",
        description: "Your response has been sent to the user.",
      });
    }
  });

  const handleRespond = async () => {
    if (!selectedRequest || !response.trim()) return;

    try {
      // Add conversation message
      await addConversationMutation.mutateAsync({
        requestId: selectedRequest.id,
        message: response
      });

      // Update request status to in_progress if it's still open
      if (selectedRequest.status === 'open') {
        await updateStatusMutation.mutateAsync({
          id: selectedRequest.id,
          status: 'in_progress'
        });
      }
    } catch (error) {
      console.error('Error responding to support request:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertTriangle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'hospital': return '🏥';
      case 'investor': return '💼';
      case 'manufacturer': return '🏭';
      default: return '👤';
    }
  };

  const filteredRequests = requests?.filter(request => {
    const matchesSearch = request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    const matchesRole = roleFilter === 'all' || request.profiles?.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesRole;
  });

  const requestCounts = {
    total: requests?.length || 0,
    open: requests?.filter(r => r.status === 'open').length || 0,
    in_progress: requests?.filter(r => r.status === 'in_progress').length || 0,
    resolved: requests?.filter(r => r.status === 'resolved').length || 0,
  };

  if (selectedRequest) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedRequest(null)}>
            ← Back to All Requests
          </Button>
          <div className="flex gap-2">
            <Select
              value={selectedRequest.status}
              onValueChange={(status) => {
                updateStatusMutation.mutate({ id: selectedRequest.id, status });
                setSelectedRequest({ ...selectedRequest, status });
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{selectedRequest.subject}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {getStatusIcon(selectedRequest.status)}
                    <span className="ml-1">{selectedRequest.status?.replace('_', ' ')}</span>
                  </Badge>
                  <Badge className={getPriorityColor(selectedRequest.priority)}>
                    {selectedRequest.priority?.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    {getRoleIcon(selectedRequest.profiles?.role)} {selectedRequest.profiles?.role}
                  </Badge>
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div>{selectedRequest.profiles?.full_name}</div>
                <div>{selectedRequest.profiles?.email}</div>
                <div>{selectedRequest.profiles?.organization}</div>
                <div className="mt-1">{new Date(selectedRequest.created_at).toLocaleString()}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Original Message:</h4>
              <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{selectedRequest.message}</p>
            </div>

            {conversations && conversations.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-4">Conversation History:</h4>
                <div className="space-y-4">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-4 rounded-lg ${
                        conv.sender_type === 'admin' 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : 'bg-gray-50 border-l-4 border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {conv.sender_type === 'admin' ? '🛡️ Admin' : '👤 User'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(conv.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{conv.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRequest.status !== 'closed' && (
              <div className="space-y-4">
                <h4 className="font-semibold">Send Response:</h4>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Type your response to the user..."
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={handleRespond}
                    disabled={!response.trim() || addConversationMutation.isPending}
                    className="bg-[#E02020] hover:bg-[#c01c1c]"
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    {addConversationMutation.isPending ? 'Sending...' : 'Send Response'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      updateStatusMutation.mutate({ 
                        id: selectedRequest.id, 
                        status: 'resolved',
                        adminResponse: response.trim() || undefined
                      });
                      if (response.trim()) {
                        handleRespond();
                      }
                    }}
                    disabled={updateStatusMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Resolved
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#333333]">Support Center</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{requestCounts.total} Total Requests</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open</p>
                <p className="text-2xl font-bold text-blue-600">{requestCounts.open}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{requestCounts.in_progress}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{requestCounts.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-[#E02020]">{requestCounts.total}</p>
              </div>
              <Users className="h-8 w-8 text-[#E02020]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Account Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hospital">🏥 Hospital</SelectItem>
                <SelectItem value="investor">💼 Investor</SelectItem>
                <SelectItem value="manufacturer">🏭 Manufacturer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests?.map((request) => (
          <Card key={request.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6" onClick={() => setSelectedRequest(request)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{request.subject}</h3>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{request.status?.replace('_', ' ')}</span>
                    </Badge>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority?.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {getRoleIcon(request.profiles?.role)} {request.profiles?.role}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{request.message}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div>
                      <span className="font-medium">{request.profiles?.full_name}</span>
                      <span className="mx-2">•</span>
                      <span>{request.profiles?.organization}</span>
                    </div>
                    <div>
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!filteredRequests || filteredRequests.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No support requests found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || roleFilter !== 'all'
                ? 'Try adjusting your filters to see more requests.'
                : 'All support requests will appear here when users submit them.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
