
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";

interface SupportRequest {
  id: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at: string;
  updated_at: string;
  admin_response: string | null;
  user_id: string;
  user_email?: string;
  user_name?: string;
}

const SupportRequestsPanel = () => {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  const fetchSupportRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_requests')
        .select(`
          *,
          profiles:user_id (
            email, 
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format the data to include user information
      const formattedData = data.map(item => ({
        ...item,
        user_email: item.profiles?.email,
        user_name: item.profiles?.full_name
      }));

      setRequests(formattedData);
    } catch (error: any) {
      toast({
        title: "Error fetching support requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    try {
      const { error } = await supabase
        .from('support_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      ));

      toast({
        title: "Status updated",
        description: `Request status changed to ${newStatus.replace('_', ' ')}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmitResponse = async (id: string) => {
    if (!response.trim()) {
      toast({
        title: "Empty response",
        description: "Please enter a response message",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('support_requests')
        .update({ 
          admin_response: response,
          status: 'resolved',
        })
        .eq('id', id);

      if (error) throw error;

      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, admin_response: response, status: 'resolved' } : req
      ));

      setResponse('');
      setResponding(null);

      toast({
        title: "Response sent",
        description: "Your response has been submitted and the request marked as resolved",
      });
    } catch (error: any) {
      toast({
        title: "Error sending response",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="p-4">Loading support requests...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Support Requests</h2>
        <Button 
          onClick={fetchSupportRequests} 
          variant="outline"
          size="sm"
        >
          Refresh
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No support requests found
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map(request => (
              <React.Fragment key={request.id}>
                <TableRow>
                  <TableCell className="font-medium">{request.subject}</TableCell>
                  <TableCell>{request.user_name || request.user_email || 'Unknown user'}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setResponding(responding === request.id ? null : request.id)}
                      >
                        {responding === request.id ? 'Cancel' : 'Reply'}
                      </Button>
                      
                      {request.status !== 'in_progress' && request.status !== 'resolved' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(request.id, 'in_progress')}
                        >
                          Mark In Progress
                        </Button>
                      )}
                      
                      {request.status !== 'resolved' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(request.id, 'resolved')}
                        >
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Details row when expanded */}
                <TableRow 
                  className={responding === request.id ? "" : "hidden"}
                >
                  <TableCell colSpan={5} className="p-4 bg-gray-50">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Request Message:</h4>
                        <p className="mt-1 text-sm whitespace-pre-wrap p-3 bg-gray-100 rounded">
                          {request.message}
                        </p>
                      </div>
                      
                      {request.admin_response && (
                        <div>
                          <h4 className="font-medium">Previous Response:</h4>
                          <p className="mt-1 text-sm whitespace-pre-wrap p-3 bg-gray-100 rounded">
                            {request.admin_response}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium">Your Response:</h4>
                        <Textarea
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          placeholder="Type your response here..."
                          className="mt-1"
                        />
                        <div className="flex justify-end mt-2">
                          <Button 
                            onClick={() => handleSubmitResponse(request.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Send Response
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default SupportRequestsPanel;
