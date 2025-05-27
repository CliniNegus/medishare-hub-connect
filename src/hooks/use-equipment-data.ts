
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EquipmentItem {
  id: string;
  name: string;
  image_url: string;
  description: string;
  price: number;
  category: string;
  manufacturer: string;
  type: 'available' | 'in-use' | 'maintenance';
  location: string;
  cluster: string;
  pricePerUse?: number;
  purchasePrice?: number;
  leaseRate?: number;
  nextAvailable?: string;
}

export function useEquipmentData() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchEquipment() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('equipment')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Transform database data to match our EquipmentItem interface
        const formattedEquipment: EquipmentItem[] = (data || []).map(item => ({
          id: item.id,
          name: item.name || 'Unnamed Equipment',
          image_url: item.image_url || '/placeholder.svg',
          description: item.description || 'No description available',
          price: item.price || 0,
          category: item.category || 'Uncategorized',
          manufacturer: item.manufacturer || 'Unknown',
          type: item.status === 'available' ? 'available' : 
                item.status === 'maintenance' ? 'maintenance' : 'in-use',
          location: item.location || 'Unknown',
          cluster: 'Main Hospital', // Default value as it might not be in the DB
          pricePerUse: Math.round(item.price / 100) || 10, // Example calculation
          purchasePrice: item.price || 0,
          leaseRate: item.lease_rate || Math.round((item.price || 0) * 0.05),
          nextAvailable: item.status !== 'available' ? '2025-06-01' : undefined,
        }));
        
        setEquipment(formattedEquipment);
        
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
    }
    
    fetchEquipment();
  }, []);
  
  return { equipment, loading, error };
}
