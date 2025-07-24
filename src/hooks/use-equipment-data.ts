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
  payPerUseEnabled?: boolean;
  payPerUsePrice?: number;
}

// Add sample enhanced cluster data
const sampleClusterNodes = [
  {
    id: 'cluster-1',
    name: 'Lagos University Teaching Hospital',
    lat: 6.5244,
    lng: 3.3792,
    equipmentCount: 24,
    availableCount: 15,
    inUseCount: 7,
    maintenanceCount: 2,
    type: 'hospital' as const,
    status: 'operational' as const,
    address: 'Idi-Araba, Surulere, Lagos State',
    contact: '+234 801 234 5678',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'cluster-2',
    name: 'National Hospital Abuja',
    lat: 9.0765,
    lng: 7.3986,
    equipmentCount: 18,
    availableCount: 12,
    inUseCount: 5,
    maintenanceCount: 1,
    type: 'hospital' as const,
    status: 'operational' as const,
    address: 'Central Business District, Abuja',
    contact: '+234 809 876 5432',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'cluster-3',
    name: 'University College Hospital',
    lat: 7.3775,
    lng: 3.9470,
    equipmentCount: 16,
    availableCount: 8,
    inUseCount: 6,
    maintenanceCount: 2,
    type: 'hospital' as const,
    status: 'partial' as const,
    address: 'Ibadan, Oyo State',
    contact: '+234 805 123 4567',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'cluster-4',
    name: 'Federal Medical Centre',
    lat: 6.2084,
    lng: 6.9318,
    equipmentCount: 12,
    availableCount: 9,
    inUseCount: 2,
    maintenanceCount: 1,
    type: 'clinic' as const,
    status: 'operational' as const,
    address: 'Owerri, Imo State',
    contact: '+234 803 987 6543',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'cluster-5',
    name: 'Ahmadu Bello University Teaching Hospital',
    lat: 11.1059,
    lng: 7.7000,
    equipmentCount: 20,
    availableCount: 13,
    inUseCount: 5,
    maintenanceCount: 2,
    type: 'hospital' as const,
    status: 'operational' as const,
    address: 'Zaria, Kaduna State',
    contact: '+234 807 654 3210',
    lastUpdated: new Date().toISOString(),
  }
];

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
          pricePerUse: item.pay_per_use_enabled ? item.pay_per_use_price : Math.round(item.price / 100) || 10,
          purchasePrice: item.price || 0,
          leaseRate: item.lease_rate || Math.round((item.price || 0) * 0.05),
          nextAvailable: item.status !== 'available' ? '2025-06-01' : undefined,
          payPerUseEnabled: item.pay_per_use_enabled || false,
          payPerUsePrice: item.pay_per_use_price || null,
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
  
  return { 
    equipment, 
    loading, 
    error,
    clusterNodes: sampleClusterNodes
  };
}
