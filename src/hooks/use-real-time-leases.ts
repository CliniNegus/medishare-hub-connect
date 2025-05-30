
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Lease {
  id: string;
  equipment_id: string;
  hospital_id: string;
  investor_id?: string;
  start_date: string;
  end_date: string;
  monthly_payment: number;
  total_value: number;
  status: string;
  created_at: string;
  updated_at: string;
  equipment?: {
    name: string;
    category: string;
    manufacturer?: string;
  };
  hospital?: {
    organization: string;
    email: string;
  };
  investor?: {
    organization: string;
    email: string;
  };
}

export const useRealTimeLeases = (statusFilter?: string) => {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const fetchLeases = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      let query = supabase
        .from('leases')
        .select(`
          *,
          equipment:equipment_id (
            name,
            category,
            manufacturer
          ),
          hospital:hospital_id (
            organization,
            email
          ),
          investor:investor_id (
            organization,
            email
          )
        `);

      // Filter based on user role
      if (profile?.role === 'hospital') {
        query = query.eq('hospital_id', user.id);
      } else if (profile?.role === 'investor') {
        query = query.eq('investor_id', user.id);
      }

      // Apply status filter if provided
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leases:', error);
        return;
      }

      setLeases(data || []);
    } catch (error) {
      console.error('Error fetching leases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeases();

    // Set up real-time subscription
    const channel = supabase
      .channel('leases-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leases'
        },
        () => {
          fetchLeases();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile, statusFilter]);

  return { leases, loading, refetch: fetchLeases };
};
