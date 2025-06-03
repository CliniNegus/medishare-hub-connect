
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityEvent {
  event_type: string;
  event_details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export const useSecurityAudit = () => {
  const { user } = useAuth();

  const logSecurityEvent = async (event: SecurityEvent) => {
    try {
      // Get client IP (this is limited in browser, but we can try)
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();

      await supabase.rpc('log_security_event', {
        event_type_param: event.event_type,
        event_details_param: event.event_details || {},
        ip_address_param: ip || null,
        user_agent_param: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const logPageView = async (page: string) => {
    if (user) {
      await logSecurityEvent({
        event_type: 'page_view',
        event_details: { page, timestamp: new Date().toISOString() }
      });
    }
  };

  const logUserAction = async (action: string, details?: Record<string, any>) => {
    if (user) {
      await logSecurityEvent({
        event_type: 'user_action',
        event_details: { action, ...details, timestamp: new Date().toISOString() }
      });
    }
  };

  const logSecurityIncident = async (incident: string, severity: 'low' | 'medium' | 'high' | 'critical', details?: Record<string, any>) => {
    await logSecurityEvent({
      event_type: 'security_incident',
      event_details: { 
        incident, 
        severity, 
        ...details, 
        timestamp: new Date().toISOString() 
      }
    });
  };

  // Monitor for suspicious activity
  useEffect(() => {
    if (!user) return;

    // Log user session start
    logSecurityEvent({
      event_type: 'session_start',
      event_details: { timestamp: new Date().toISOString() }
    });

    // Monitor for rapid page changes (potential bot behavior)
    let pageChangeCount = 0;
    let pageChangeTimer: NodeJS.Timeout;

    const resetPageChangeCounter = () => {
      pageChangeCount = 0;
    };

    const handleLocationChange = () => {
      pageChangeCount++;
      
      clearTimeout(pageChangeTimer);
      pageChangeTimer = setTimeout(resetPageChangeCounter, 10000); // Reset after 10 seconds

      if (pageChangeCount > 10) {
        logSecurityIncident('rapid_page_changes', 'medium', {
          page_changes: pageChangeCount,
          timeframe: '10_seconds'
        });
      }
    };

    // Listen for route changes
    window.addEventListener('popstate', handleLocationChange);

    // Monitor for multiple failed form submissions
    let formErrorCount = 0;
    let formErrorTimer: NodeJS.Timeout;

    const handleFormError = () => {
      formErrorCount++;
      
      clearTimeout(formErrorTimer);
      formErrorTimer = setTimeout(() => { formErrorCount = 0; }, 60000); // Reset after 1 minute

      if (formErrorCount > 5) {
        logSecurityIncident('multiple_form_errors', 'medium', {
          error_count: formErrorCount,
          timeframe: '1_minute'
        });
      }
    };

    // Global error handler for forms
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.message.includes('form') || event.message.includes('validation')) {
        handleFormError();
      }
    };

    window.addEventListener('error', handleGlobalError);

    // Cleanup
    return () => {
      // Log session end
      logSecurityEvent({
        event_type: 'session_end',
        event_details: { timestamp: new Date().toISOString() }
      });

      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('error', handleGlobalError);
      clearTimeout(pageChangeTimer);
      clearTimeout(formErrorTimer);
    };
  }, [user]);

  return {
    logSecurityEvent,
    logPageView,
    logUserAction,
    logSecurityIncident
  };
};

export default useSecurityAudit;
