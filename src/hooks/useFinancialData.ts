
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FinancialMetrics {
  totalRevenue: number;
  activeLeases: number;
  pendingInvoices: number;
  pendingInvoicesAmount: number;
  cashFlow: number;
  totalExpenses: number;
}

interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paystack_reference?: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
  user_id: string;
  user_email?: string;
  user_name?: string;
}

export const useFinancialData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalRevenue: 0,
    activeLeases: 0,
    pendingInvoices: 0,
    pendingInvoicesAmount: 0,
    cashFlow: 0,
    totalExpenses: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      // First, get all transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Then, get user profiles for the user IDs we have
      const userIds = [...new Set(transactionsData?.map(t => t.user_id) || [])];
      
      let profilesData: any[] = [];
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          profilesData = profiles || [];
        }
      }

      // Create a map of user profiles for quick lookup
      const profilesMap = new Map(
        profilesData.map(profile => [profile.id, profile])
      );

      // Transform the transactions to include user information
      const transformedTransactions: Transaction[] = (transactionsData || []).map(transaction => {
        const profile = profilesMap.get(transaction.user_id);
        return {
          ...transaction,
          user_email: profile?.email || 'Unknown',
          user_name: profile?.full_name || 'Unknown User'
        };
      });

      setTransactions(transformedTransactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    }
  };

  const fetchMetrics = async () => {
    try {
      // Calculate revenue from successful transactions
      const { data: successfulTransactions, error: transError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'success');

      if (transError) throw transError;

      const totalRevenue = successfulTransactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      // Get active leases count
      const { count: activeLeases, error: leasesError } = await supabase
        .from('leases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (leasesError) throw leasesError;

      // Get pending invoices (using sample data for now)
      const pendingInvoices = 3; // Mock data
      const pendingInvoicesAmount = 4850000; // Mock data in KES

      // Calculate current month cash flow
      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data: monthlyTransactions, error: monthlyError } = await supabase
        .from('transactions')
        .select('amount')
        .gte('created_at', firstDay.toISOString())
        .lte('created_at', lastDay.toISOString())
        .eq('status', 'success');

      if (monthlyError) throw monthlyError;

      const monthlyCashFlow = monthlyTransactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      setMetrics({
        totalRevenue,
        activeLeases: activeLeases || 0,
        pendingInvoices,
        pendingInvoicesAmount,
        cashFlow: monthlyCashFlow,
        totalExpenses: 0 // Can be calculated based on business logic
      });

    } catch (error: any) {
      console.error('Error fetching metrics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch financial metrics",
        variant: "destructive",
      });
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchTransactions(), fetchMetrics()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    transactions,
    metrics,
    loading,
    refreshData
  };
};
