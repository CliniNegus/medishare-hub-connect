import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AccountTypeChangeRequest {
  id: string;
  user_id: string;
  from_role: string;
  to_role: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_feedback: string | null;
  reviewed_by: string | null;
  created_at: string;
  reviewed_at: string | null;
  updated_at: string;
}

interface UseAccountTypeChangeRequestResult {
  pendingRequest: AccountTypeChangeRequest | null;
  recentRequests: AccountTypeChangeRequest[];
  loading: boolean;
  error: string | null;
  hasPendingRequest: boolean;
  submitRequest: (toRole: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useAccountTypeChangeRequest(): UseAccountTypeChangeRequestResult {
  const { user, profile } = useAuth();
  const [pendingRequest, setPendingRequest] = useState<AccountTypeChangeRequest | null>(null);
  const [recentRequests, setRecentRequests] = useState<AccountTypeChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use raw query with explicit typing since table was just created
      const { data, error: fetchError } = await supabase
        .from('account_type_change_requests' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const requests = (data || []) as unknown as AccountTypeChangeRequest[];
      setRecentRequests(requests);
      
      const pending = requests.find(r => r.status === 'pending');
      setPendingRequest(pending || null);
    } catch (err: any) {
      console.error('Error fetching account type change requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('account_type_change_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'account_type_change_requests',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchRequests]);

  const submitRequest = useCallback(async (toRole: string): Promise<boolean> => {
    if (!user?.id || !profile?.role) {
      setError('User not authenticated');
      return false;
    }

    // Check if there's already a pending request
    if (pendingRequest) {
      setError('You already have a pending account type change request');
      return false;
    }

    try {
      const { error: insertError } = await supabase
        .from('account_type_change_requests' as any)
        .insert({
          user_id: user.id,
          from_role: profile.role,
          to_role: toRole,
          status: 'pending',
        });

      if (insertError) throw insertError;

      // Notify admins - use notification system
      // The admin will be notified via the notifications table
      await fetchRequests();
      return true;
    } catch (err: any) {
      console.error('Error submitting account type change request:', err);
      setError(err.message);
      return false;
    }
  }, [user?.id, profile?.role, pendingRequest, fetchRequests]);

  return {
    pendingRequest,
    recentRequests,
    loading,
    error,
    hasPendingRequest: !!pendingRequest,
    submitRequest,
    refetch: fetchRequests,
  };
}
