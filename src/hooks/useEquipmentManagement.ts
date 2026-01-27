import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type VisibilityStatus = 'hidden' | 'visible_all' | 'visible_hospitals' | 'visible_investors';

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
  sku: string | null;
  condition: string | null;
  specs: string | null;
  quantity: number | null;
  sales_option: string | null;
  usage_hours: number | null;
  downtime_hours: number | null;
  revenue_generated: number | null;
  remote_control_enabled: boolean | null;
  payment_status: string | null;
  pay_per_use_enabled: boolean | null;
  pay_per_use_price: number | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
  visibility_status?: string | null;
  visibility_updated_by?: string | null;
  visibility_updated_at?: string | null;
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
      // The RLS policies in the database will handle authorization
      // If user is not authorized, they'll get a policy violation error
      const { data, error } = await supabase
        .from('equipment')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        // Handle specific authorization errors
        if (error.code === '42501' || error.message.includes('policy')) {
          toast({
            title: "Access denied",
            description: "You don't have permission to update this equipment.",
            variant: "destructive",
          });
          throw new Error("Access denied: You don't have permission to update this equipment.");
        }
        throw error;
      }

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

  const deleteEquipment = async (id: string): Promise<boolean> => {
    try {
      // RLS policies will handle authorization - only owner or admin can delete
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (error) {
        // Handle specific authorization errors
        if (error.code === '42501' || error.message.includes('policy')) {
          toast({
            title: "Access denied",
            description: "You don't have permission to delete this equipment.",
            variant: "destructive",
          });
          throw new Error("Access denied: You don't have permission to delete this equipment.");
        }
        throw error;
      }

      // Update local state
      setEquipment(prev => prev.filter(item => item.id !== id));

      toast({
        title: "Equipment deleted",
        description: "Equipment has been permanently removed from the system.",
      });

      return true;
    } catch (err: any) {
      console.error('Error deleting equipment:', err);
      toast({
        title: "Error deleting equipment",
        description: err.message,
        variant: "destructive",
      });
      return false;
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
    deleteEquipment,
  };
};
