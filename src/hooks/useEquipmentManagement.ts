
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Equipment {
  id: string;
  name: string;
  manufacturer: string | null;
  status: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  category: string | null;
  price: number | null;
  lease_rate: number | null;
  model: string | null;
  serial_number: string | null;
  condition: string | null;
  specs: string | null;
  quantity: number | null;
  sales_option: string | null;
  usage_hours: number | null;
  downtime_hours: number | null;
  revenue_generated: number | null;
  remote_control_enabled: boolean | null;
  payment_status: string | null;
  created_at: string;
  updated_at: string;
}

export const useEquipmentManagement = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEquipment(data || []);
    } catch (err: any) {
      console.error('Error fetching equipment:', err);
      setError(err.message);
      toast({
        title: "Error loading equipment",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setEquipment(prev => prev.map(item => 
        item.id === id ? { ...item, ...data } : item
      ));

      toast({
        title: "Equipment updated",
        description: "Equipment has been successfully updated.",
      });

      return data;
    } catch (err: any) {
      console.error('Error updating equipment:', err);
      toast({
        title: "Error updating equipment",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  return {
    equipment,
    loading,
    error,
    fetchEquipment,
    updateEquipment,
  };
};
