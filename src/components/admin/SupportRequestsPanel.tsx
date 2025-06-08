
import React from 'react';
import { SupportRequestsList } from './support/SupportRequestsList';
import { ChatInterface } from './support/ChatInterface';
import { useSupportRequests } from './support/useSupportRequests';

export function SupportRequestsPanel() {
  const {
    requests,
    selectedRequest,
    messages,
    setMessages,
    handleSelectRequest,
    handleResolveRequest,
    getStatusColor,
    getPriorityColor,
    refetch
  } = useSupportRequests();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
      <SupportRequestsList
        requests={requests}
        selectedRequest={selectedRequest}
        onSelectRequest={handleSelectRequest}
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
      />
      <ChatInterface
        selectedRequest={selectedRequest}
        messages={messages}
        setMessages={setMessages}
        onResolveRequest={handleResolveRequest}
        refetch={refetch}
      />
    </div>
  );
}
