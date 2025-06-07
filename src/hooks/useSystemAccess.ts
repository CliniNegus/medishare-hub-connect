
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuditLogger } from './useAuditLogger';

export function useSystemAccess() {
  const { user } = useAuth();
  const { logAuditEvent } = useAuditLogger();

  // Log system access for audit purposes
  useEffect(() => {
    const logAccess = async () => {
      if (!user) return;
      
      try {
        await logAuditEvent(
          'SYSTEM_PAGE_ACCESS',
          'system_management',
          null
        );
      } catch (error) {
        console.error('Error logging system access:', error);
      }
    };
    
    logAccess();
  }, [user, logAuditEvent]);

  return null;
}
