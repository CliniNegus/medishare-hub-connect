import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useDemoAccounts() {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createDemoAccounts = async () => {
    try {
      setIsCreating(true);
      
      const { data, error } = await supabase.functions.invoke('create-demo-accounts');
      
      if (error) {
        throw error;
      }

      toast({
        title: "Demo Accounts Created",
        description: "Successfully set up demo accounts for all roles",
      });

      return data;
    } catch (error) {
      console.error('Error creating demo accounts:', error);
      toast({
        title: "Error",
        description: "Failed to create demo accounts",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createDemoAccounts,
    isCreating
  };
}