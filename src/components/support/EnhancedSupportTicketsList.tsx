import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSupportTickets } from '@/hooks/useSupportTickets';
import { SUPPORT_STATUSES, SUPPORT_CATEGORIES } from '@/types/support';
import { TicketDetailDialog } from './TicketDetailDialog';
import { Clock, CheckCircle, AlertCircle, XCircle, MessageSquare, Paperclip } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function EnhancedSupportTicketsList() {
  const { tickets, ticketsLoading, setSelectedTicketId } = useSupportTickets();
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleOpenTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setDialogOpen(true);
  };

  if (ticketsLoading) {
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
          <CardDescription>
            You haven't submitted any support tickets yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tickets yet</p>
            <p className="text-sm mt-1">Submit a ticket using the form</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">My Support Tickets</CardTitle>
          <CardDescription>
            Track the status of your support requests ({tickets.length} ticket{tickets.length !== 1 ? 's' : ''})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {tickets.map((ticket) => {
              const statusInfo = SUPPORT_STATUSES.find(s => s.value === ticket.status);
              const categoryInfo = SUPPORT_CATEGORIES.find(c => c.value === ticket.category);

              return (
                <div
                  key={ticket.id}
                  className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleOpenTicket(ticket.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-foreground">{ticket.subject}</h4>
                        <Badge className={statusInfo?.color || 'bg-gray-100'}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(ticket.status || 'open')}
                            {statusInfo?.label || ticket.status}
                          </span>
                        </Badge>
                        {categoryInfo && (
                          <Badge variant="outline">{categoryInfo.label}</Badge>
                        )}
                        {ticket.file_url && (
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ticket.message}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <TicketDetailDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
