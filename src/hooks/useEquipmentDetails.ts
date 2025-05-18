
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EquipmentDetails } from '@/types/equipment';
import { useToast } from '@/hooks/use-toast';

export function useEquipmentDetails(equipmentId: string | undefined) {
  const [equipment, setEquipment] = useState<EquipmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      if (!equipmentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('equipment')
          .select('*')
          .eq('id', equipmentId)
          .single();
          
        if (error) throw error;
        
        setEquipment(data as EquipmentDetails);
      } catch (error: any) {
        console.error('Error fetching equipment details:', error.message);
        toast({
          title: "Failed to load equipment details",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEquipmentDetails();
  }, [equipmentId, toast]);

  const refreshEquipment = async () => {
    if (!equipmentId) return;
    
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('id', equipmentId)
        .single();
        
      if (error) throw error;
      
      setEquipment(data as EquipmentDetails);
    } catch (error: any) {
      console.error('Error refreshing equipment details:', error.message);
    }
  };

  return { equipment, loading, refreshEquipment };
}
