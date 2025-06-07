
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useDataArchive() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [archivingData, setArchivingData] = useState(false);

  // Archive old data
  const archiveOldData = async (
    tableName: string,
    cutoffDate: Date,
    reason: string = 'Automated archival'
  ) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You need to be signed in to perform this action',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setArchivingData(true);
      
      const { data, error } = await supabase.rpc('archive_old_data', {
        table_name_param: tableName,
        cutoff_date: cutoffDate.toISOString(),
        reason_param: reason
      });

      if (error) throw error;

      toast({
        title: 'Archive Complete',
        description: 'Data archival process has been completed',
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to archive old data',
        variant: 'destructive',
      });
      return null;
    } finally {
      setArchivingData(false);
    }
  };

  return {
    archivingData,
    archiveOldData
  };
}
