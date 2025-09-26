import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PopularEquipment {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  status: string;
  location: string;
  image_url: string;
  popularity_score: number;
  is_featured: boolean;
  booking_count: number;
}

export const usePopularEquipment = (limit: number = 5) => {
  const [equipment, setEquipment] = useState<PopularEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularEquipment = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: rpcError } = await supabase
        .rpc('get_top_popular_equipment', { limit_count: limit });

      if (rpcError) throw rpcError;

      setEquipment(data || []);
    } catch (err) {
      console.error('Error fetching popular equipment:', err);
      setError('Failed to fetch popular equipment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularEquipment();

    // Set up real-time subscription for equipment changes
    const channel = supabase
      .channel('popular-equipment-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'equipment' }, 
        () => {
          fetchPopularEquipment();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' }, 
        () => {
          fetchPopularEquipment();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return {
    equipment,
    loading,
    error,
    refetch: fetchPopularEquipment
  };
};