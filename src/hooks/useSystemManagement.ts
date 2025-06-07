
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useSystemManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState(false);

  // Log system access for audit purposes
  useEffect(() => {
    const logAccess = async () => {
      if (!user) return;
      
      try {
        await supabase.rpc('log_audit_event', {
          action_param: 'SYSTEM_PAGE_ACCESS',
          resource_type_param: 'system_management',
          resource_id_param: null
        });
      } catch (error) {
        console.error('Error logging system access:', error);
      }
    };
    
    logAccess();
  }, [user]);

  // Create a data backup
  const createBackup = async (name: string, backupType: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You need to be signed in to perform this action',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setProcessingAction(true);
      
      const { data, error } = await supabase.rpc('create_data_backup', {
        name_param: name,
        backup_type_param: backupType
      });

      if (error) throw error;

      toast({
        title: 'Backup Created',
        description: 'Data backup process has been initiated',
      });

      return data;
    } catch (error: any) {
      setError(error.message || 'An error occurred creating the backup');
      toast({
        title: 'Error',
        description: 'Failed to create data backup',
        variant: 'destructive',
      });
      return null;
    } finally {
      setProcessingAction(false);
    }
  };

  // Send system message
  const sendSystemMessage = async (
    recipientId: string | null,
    recipientRole: string | null,
    subject: string,
    content: string,
    messageType: string = 'direct',
    priority: string = 'normal'
  ) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You need to be signed in to perform this action',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setProcessingAction(true);
      
      const { data, error } = await supabase.rpc('send_system_message', {
        recipient_id_param: recipientId,
        recipient_role_param: recipientRole,
        subject_param: subject,
        content_param: content,
        message_type_param: messageType,
        priority_param: priority
      });

      if (error) throw error;

      toast({
        title: 'Message Sent',
        description: 'System message has been sent successfully',
      });

      return data;
    } catch (error: any) {
      setError(error.message || 'An error occurred sending the message');
      toast({
        title: 'Error',
        description: 'Failed to send system message',
        variant: 'destructive',
      });
      return null;
    } finally {
      setProcessingAction(false);
    }
  };

  // Archive old data
  const archiveOldData = async (
    tableName: string,
    cutoffDate: Date,
    reason: string = 'Automated archival'
  ) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You need to be signed in to perform this action',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setProcessingAction(true);
      
      const { data, error } = await supabase.rpc('archive_old_data', {
        table_name_param: tableName,
        cutoff_date: cutoffDate.toISOString(),
        reason_param: reason
      });

      if (error) throw error;

      toast({
        title: 'Archive Complete',
        description: 'Data archival process has been completed',
      });

      return data;
    } catch (error: any) {
      setError(error.message || 'An error occurred archiving the data');
      toast({
        title: 'Error',
        description: 'Failed to archive old data',
        variant: 'destructive',
      });
      return null;
    } finally {
      setProcessingAction(false);
    }
  };

  // Log audit event
  const logAuditEvent = async (
    action: string,
    resourceType: string,
    resourceId?: string,
    oldValues?: any,
    newValues?: any
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('log_audit_event', {
        action_param: action,
        resource_type_param: resourceType,
        resource_id_param: resourceId || null,
        old_values_param: oldValues ? JSON.stringify(oldValues) : null,
        new_values_param: newValues ? JSON.stringify(newValues) : null
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging audit event:', error);
      return null;
    }
  };

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
