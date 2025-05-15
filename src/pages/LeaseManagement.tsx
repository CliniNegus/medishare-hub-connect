
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import LeaseStats from '@/components/leases/LeaseStats'; 
import LeasesList from '@/components/leases/LeasesList';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const LeaseManagement = () => {
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const fetchLeases = async () => {
    setLoading(true);
    try {
      let query = supabase.from('leases').select(`
        *,
        equipment:equipment_id(*),
        hospital:hospital_id(*),
        investor:investor_id(*)
      `);
      
      // Filter based on user role if not admin
      if (profile?.role === 'hospital') {
        query = query.eq('hospital_id', user?.id);
      } else if (profile?.role === 'investor') {
        query = query.eq('investor_id', user?.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setLeases(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching leases",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLeases();
    }
  }, [user]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#333333]">Lease Management</h1>
        </div>
        
        <LeaseStats leases={leases} userRole={profile?.role} />
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">All Leases</h2>
            <LeasesList 
              leases={leases} 
              loading={loading} 
              onRefresh={fetchLeases}
              userRole={profile?.role} 
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaseManagement;
