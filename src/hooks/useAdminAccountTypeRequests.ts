import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AccountTypeChangeRequestWithUser {
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
  user_email?: string;
  user_name?: string;
}

interface UseAdminAccountTypeRequestsResult {
  requests: AccountTypeChangeRequestWithUser[];
  pendingCount: number;
  loading: boolean;
  error: string | null;
  approveRequest: (requestId: string) => Promise<boolean>;
  rejectRequest: (requestId: string, feedback: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useAdminAccountTypeRequests(): UseAdminAccountTypeRequestsResult {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AccountTypeChangeRequestWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch requests - use 'as any' since table was just created
      const { data: requestsData, error: requestsError } = await supabase
        .from('account_type_change_requests' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      const rawRequests = (requestsData || []) as unknown as AccountTypeChangeRequestWithUser[];

      // Fetch user profiles for all requests
      const userIds = [...new Set(rawRequests.map(r => r.user_id))];
      
      let profilesMap: Record<string, { email: string; full_name: string }> = {};
      
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', userIds);

        if (profilesData) {
          profilesMap = profilesData.reduce((acc, p) => {
            acc[p.id] = { email: p.email || '', full_name: p.full_name || '' };
            return acc;
          }, {} as Record<string, { email: string; full_name: string }>);
        }
      }

      const enrichedRequests: AccountTypeChangeRequestWithUser[] = rawRequests.map(r => ({
        ...r,
        user_email: profilesMap[r.user_id]?.email || 'Unknown',
        user_name: profilesMap[r.user_id]?.full_name || 'Unknown User',
      }));

      setRequests(enrichedRequests);
    } catch (err: any) {
      console.error('Error fetching account type change requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('admin_account_type_change_requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'account_type_change_requests',
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRequests]);

  const approveRequest = useCallback(async (requestId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { data, error } = await supabase.rpc('approve_account_type_change' as any, {
        request_id: requestId,
        admin_user_id: user.id,
      });

      if (error) throw error;

      await fetchRequests();
      return data === true;
    } catch (err: any) {
      console.error('Error approving request:', err);
      setError(err.message);
      return false;
    }
  }, [user?.id, fetchRequests]);

  const rejectRequest = useCallback(async (requestId: string, feedback: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { data, error } = await supabase.rpc('reject_account_type_change' as any, {
        request_id: requestId,
        admin_user_id: user.id,
        feedback,
      });

      if (error) throw error;

      await fetchRequests();
      return data === true;
    } catch (err: any) {
      console.error('Error rejecting request:', err);
      setError(err.message);
      return false;
    }
  }, [user?.id, fetchRequests]);

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return {
    requests,
    pendingCount,
    loading,
    error,
    approveRequest,
    rejectRequest,
    refetch: fetchRequests,
  };
}
