import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const SupportTicketsList = () => {
  const { user } = useAuth();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['support-tickets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('support_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'normal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">My Support Tickets</CardTitle>
          <CardDescription>Loading your tickets...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">My Support Tickets</CardTitle>
          <CardDescription>You haven't submitted any support tickets yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">My Support Tickets</CardTitle>
        <CardDescription>Track the status of your support requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-foreground">{ticket.subject}</h4>
                    <Badge className={getStatusColor(ticket.status || 'open')}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(ticket.status || 'open')}
                        {ticket.status?.replace('_', ' ')}
                      </span>
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority || 'normal')}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ticket.message}
                  </p>
                  
                  {ticket.admin_response && (
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium text-foreground mb-1">Support Response:</p>
                      <p className="text-sm text-muted-foreground">{ticket.admin_response}</p>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportTicketsList;
