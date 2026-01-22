import React from 'react';
import { AdminSupportTicketsList } from './AdminSupportTicketsList';
import { AdminChatInterface } from './AdminChatInterface';
import { useAdminSupportTickets } from '@/hooks/useAdminSupportTickets';

export function EnhancedSupportRequestsPanel() {
  const supportTicketsState = useAdminSupportTickets();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[650px]">
      <AdminSupportTicketsList {...supportTicketsState} />
      <AdminChatInterface {...supportTicketsState} />
    </div>
  );
}
