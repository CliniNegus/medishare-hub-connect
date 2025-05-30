
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
          equipment!inner (
            name,
            category,
            manufacturer
          ),
          hospital:profiles!leases_hospital_id_fkey (
            organization,
            email
          ),
          investor:profiles!leases_investor_id_fkey (
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

      // Transform the data to match our interface
      const transformedLeases: Lease[] = (data || []).map(lease => ({
        id: lease.id,
        equipment_id: lease.equipment_id,
        hospital_id: lease.hospital_id,
        investor_id: lease.investor_id,
        start_date: lease.start_date,
        end_date: lease.end_date,
        monthly_payment: lease.monthly_payment,
        total_value: lease.total_value,
        status: lease.status,
        created_at: lease.created_at,
        updated_at: lease.updated_at,
        equipment: lease.equipment ? {
          name: lease.equipment.name,
          category: lease.equipment.category,
          manufacturer: lease.equipment.manufacturer
        } : undefined,
        hospital: lease.hospital ? {
          organization: lease.hospital.organization || 'Unknown Hospital',
          email: lease.hospital.email || ''
        } : undefined,
        investor: lease.investor ? {
          organization: lease.investor.organization || 'Unknown Investor',
          email: lease.investor.email || ''
        } : undefined
      }));

      setLeases(transformedLeases);
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
