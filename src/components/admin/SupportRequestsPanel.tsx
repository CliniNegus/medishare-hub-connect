
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { SupportRequest } from '@/types/support';
import { useToast } from '@/components/ui/use-toast';

export function SupportRequestsPanel() {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: requests, refetch, isLoading, error } = useQuery({
    queryKey: ['supportRequests'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('support_requests')
          .select(`
            *,
            profiles:user_id(email, full_name)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching support requests:', error);
          throw error;
        }

        return data as SupportRequest[];
      } catch (error) {
        console.error('Error in support requests query:', error);
        throw error;
      }
    },
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  const handleRespond = async () => {
    if (!selectedRequest || !response.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('support_requests')
        .update({
          admin_response: response.trim(),
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id);

      if (error) {
        console.error('Error responding to support request:', error);
        throw error;
      }

      toast({
        title: "Response sent",
        description: "Support request has been resolved.",
      });

      setSelectedRequest(null);
      setResponse('');
      refetch();
    } catch (error: any) {
      console.error('Error responding to support request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Support Requests</h2>
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Loading support requests...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Support Requests</h2>
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500">Error loading support requests. Please try again.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Support Requests</h2>
      <div className="grid gap-4">
        {requests?.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No support requests found.
          </div>
        ) : (
          requests?.map((request) => (
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
                    className="bg-[#E02020] hover:bg-[#B91C1C] text-white"
                  >
                    Respond
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {selectedRequest && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Respond to: {selectedRequest.subject}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full mb-4"
              placeholder="Type your response..."
              rows={4}
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleRespond}
                disabled={!response.trim() || isSubmitting}
                className="bg-[#E02020] hover:bg-[#B91C1C] text-white"
              >
                {isSubmitting ? "Sending..." : "Send Response"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRequest(null);
                  setResponse('');
                }}
                disabled={isSubmitting}
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
