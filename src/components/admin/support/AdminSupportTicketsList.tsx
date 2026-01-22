import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUPPORT_STATUSES, SUPPORT_CATEGORIES, SupportStatus, SupportCategory, SupportRequestWithProfile } from '@/types/support';
import { MessageCircle, User, Clock, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface AdminFilters {
  status?: SupportStatus | 'all';
  category?: SupportCategory | 'all';
  accountType?: string | 'all';
}

interface AdminSupportTicketsListProps {
  tickets: SupportRequestWithProfile[] | undefined;
  ticketsLoading: boolean;
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;
  filters: AdminFilters;
  setFilters: React.Dispatch<React.SetStateAction<AdminFilters>>;
}

export function AdminSupportTicketsList({
  tickets,
  ticketsLoading,
  selectedTicketId,
  setSelectedTicketId,
  filters,
  setFilters,
}: AdminSupportTicketsListProps) {
  const accountTypes = [
    { value: 'all', label: 'All Account Types' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'manufacturer', label: 'Manufacturer' },
    { value: 'investor', label: 'Investor' },
  ];

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <MessageCircle className="mr-2 h-5 w-5 text-[#E02020]" />
          Support Tickets
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </div>
          <Select
            value={filters.status || 'all'}
            onValueChange={(val) => setFilters(prev => ({ ...prev, status: val as SupportStatus | 'all' }))}
          >
            <SelectTrigger className="w-[140px] h-8 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {SUPPORT_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.category || 'all'}
            onValueChange={(val) => setFilters(prev => ({ ...prev, category: val as SupportCategory | 'all' }))}
          >
            <SelectTrigger className="w-[140px] h-8 text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {SUPPORT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.accountType || 'all'}
            onValueChange={(val) => setFilters(prev => ({ ...prev, accountType: val }))}
          >
            <SelectTrigger className="w-[150px] h-8 text-sm">
              <SelectValue placeholder="Account Type" />
            </SelectTrigger>
            <SelectContent>
              {accountTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full">
          {ticketsLoading ? (
            <div className="text-center text-muted-foreground py-8">
              Loading tickets...
            </div>
          ) : tickets?.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No tickets found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets?.map((ticket) => {
                const statusInfo = SUPPORT_STATUSES.find(s => s.value === ticket.status);
                const categoryInfo = SUPPORT_CATEGORIES.find(c => c.value === ticket.category);
                
                return (
                  <Card
                    key={ticket.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedTicketId === ticket.id ? 'ring-2 ring-[#E02020]' : ''
                    }`}
                    onClick={() => setSelectedTicketId(ticket.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm line-clamp-1">{ticket.subject}</h3>
                        <div className="flex gap-1 flex-shrink-0">
                          <Badge className={`text-xs ${statusInfo?.color}`}>
                            {statusInfo?.label || ticket.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {categoryInfo && (
                          <Badge variant="outline" className="text-xs">
                            {categoryInfo.label}
                          </Badge>
                        )}
                        {ticket.account_type && (
                          <Badge variant="secondary" className="text-xs capitalize">
                            {ticket.account_type}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <User className="h-3 w-3 mr-1" />
                        {ticket.profiles?.full_name || ticket.profiles?.email || 'Unknown User'}
                      </div>

                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(ticket.created_at), 'MMM d, yyyy h:mm a')}
                      </div>

                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {ticket.message}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
