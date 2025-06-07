
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useAuditLogger() {
  const { user } = useAuth();

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
    logAuditEvent
  };
}
