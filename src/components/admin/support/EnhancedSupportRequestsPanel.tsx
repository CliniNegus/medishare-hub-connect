import React from 'react';
import { AdminSupportTicketsList } from './AdminSupportTicketsList';
import { AdminChatInterface } from './AdminChatInterface';

export function EnhancedSupportRequestsPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[650px]">
      <AdminSupportTicketsList />
      <AdminChatInterface />
    </div>
  );
}
