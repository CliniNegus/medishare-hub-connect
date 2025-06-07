
import { useState } from 'react';
import { useDataBackup } from './useDataBackup';
import { useSystemMessaging } from './useSystemMessaging';
import { useDataArchive } from './useDataArchive';
import { useAuditLogger } from './useAuditLogger';
import { useSystemAccess } from './useSystemAccess';

export function useSystemManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the smaller, focused hooks
  const { processingBackup, createBackup } = useDataBackup();
  const { sendingMessage, sendSystemMessage } = useSystemMessaging();
  const { archivingData, archiveOldData } = useDataArchive();
  const { logAuditEvent } = useAuditLogger();
  
  // Log system access
  useSystemAccess();

  // Determine if any operation is in progress
  const processingAction = processingBackup || sendingMessage || archivingData;

  return {
    loading,
    error,
    processingAction,
    createBackup,
    sendSystemMessage,
    archiveOldData,
    logAuditEvent
  };
}
