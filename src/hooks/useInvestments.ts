
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Investment {
  id: string;
  hospital: string;
  equipment: string;
  amount: number;
  date: string;
  term: string;
  roi: number;
  status: 'active' | 'completed' | 'pending';
  notes?: string;
}

interface UseInvestmentsReturn {
  investments: Investment[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createInvestment: (data: {
    hospital_id: string;
    equipment_id: string;
    amount: number;
    term: string;
    roi: number;
    notes?: string;
  }) => Promise<{ success: boolean; error?: Error }>;
}

export const useInvestments = (): UseInvestmentsReturn => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchInvestments = async () => {
    if (!user) {
      setInvestments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('investments')
        .select(`
          id, 
          amount, 
          date, 
          term, 
          roi, 
          status, 
          notes,
          hospitals:hospital_id(name),
          equipment:equipment_id(name)
        `)
        .eq('investor_id', user.id);
      
      if (fetchError) throw fetchError;
      
      const formattedInvestments = data.map(item => ({
        id: item.id,
        hospital: item.hospitals?.name || 'Unknown Hospital',
        equipment: item.equipment?.name || 'Unknown Equipment',
        amount: Number(item.amount),
        date: new Date(item.date).toISOString().split('T')[0],
        term: item.term,
        roi: Number(item.roi),
        status: (item.status as 'active' | 'completed' | 'pending'),
        notes: item.notes
      }));
      
      setInvestments(formattedInvestments);
    } catch (err: any) {
      console.error('Error fetching investments:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [user]);

  const createInvestment = async (data: {
    hospital_id: string;
    equipment_id: string;
    amount: number;
    term: string;
    roi: number;
    notes?: string;
  }) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create an investment",
        variant: "destructive",
      });
      return { success: false, error: new Error("Authentication required") };
    }

    try {
      const { error: insertError } = await supabase.from('investments').insert({
        investor_id: user.id,
        hospital_id: data.hospital_id,
        equipment_id: data.equipment_id,
        amount: data.amount,
        term: data.term,
        roi: data.roi,
        notes: data.notes,
      });
      
      if (insertError) throw insertError;
      
      await fetchInvestments();
      return { success: true };
    } catch (err: any) {
      console.error('Error creating investment:', err);
      toast({
        title: "Failed to Create Investment",
        description: err.message || "An error occurred while creating your investment",
        variant: "destructive",
      });
      return { success: false, error: err };
    }
  };

  return {
    investments,
    isLoading,
    error,
    refetch: fetchInvestments,
    createInvestment
  };
};
