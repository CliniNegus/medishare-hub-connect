
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useDataBackup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [processingBackup, setProcessingBackup] = useState(false);

  // Create a data backup
  const createBackup = async (name: string, backupType: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You need to be signed in to perform this action',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setProcessingBackup(true);
      
      const { data, error } = await supabase.rpc('create_data_backup', {
        name_param: name,
        backup_type_param: backupType
      });

      if (error) throw error;

      toast({
        title: 'Backup Created',
        description: 'Data backup process has been initiated',
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to create data backup',
        variant: 'destructive',
      });
      return null;
    } finally {
      setProcessingBackup(false);
    }
  };

  return {
    processingBackup,
    createBackup
  };
}
