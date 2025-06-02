
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SupportRequest } from '@/types/support';
import { useToast } from '@/components/ui/use-toast';

export function SupportRequestsPanel() {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [response, setResponse] = useState('');

  const { data: requests, refetch } = useQuery({
    queryKey: ['supportRequests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_requests')
        .select('*, profiles:user_id(email, full_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SupportRequest[];
    }
  });

  const handleRespond = async () => {
    if (!selectedRequest || !response) return;

    try {
      const { error } = await supabase
        .from('support_requests')
        .update({
          admin_response: response,
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast({
        title: "Response sent",
        description: "Support request has been resolved.",
      });

      setSelectedRequest(null);
      setResponse('');
      refetch();
    } catch (error) {
      console.error('Error responding to support request:', error);
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Support Requests</h2>
      <div className="grid gap-4">
        {requests?.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {request.subject}
                <span className={`ml-2 text-sm px-2 py-1 rounded ${
                  request.status === 'open' ? 'bg-red-100 text-red-800' :
                  request.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {request.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{request.message}</p>
              {request.admin_response ? (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-semibold">Admin Response:</p>
                  <p>{request.admin_response}</p>
                </div>
              ) : request.status === 'open' && (
                <Button
                  onClick={() => setSelectedRequest(request)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Respond
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedRequest && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Respond to: {selectedRequest.subject}</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full p-2 border rounded-md min-h-[100px] mb-4"
              placeholder="Type your response..."
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleRespond}
                className="bg-red-600 hover:bg-red-700"
              >
                Send Response
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRequest(null);
                  setResponse('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
