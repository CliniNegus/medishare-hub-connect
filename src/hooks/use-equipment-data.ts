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
  // Additional properties for admin/manufacturer views
  status?: string;
  usageHours?: number;
  revenueGenerated?: number;
  ownerId?: string;
  // Fields needed for edit modal
  model?: string;
  serial_number?: string;
  sku?: string;
  condition?: string;
  specs?: string;
  quantity?: number;
  sales_option?: string;
  downtime_hours?: number;
  remote_control_enabled?: boolean;
  pay_per_use_enabled?: boolean;
  pay_per_use_price?: number;
  lease_rate?: number;
  owner_id?: string;
}

interface EquipmentRevenueMap {
  [equipmentId: string]: number;
}

interface UseEquipmentDataOptions {
  ownerId?: string;
}

export function useEquipmentData(options?: UseEquipmentDataOptions) {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch revenue from completed orders for each equipment
  const fetchEquipmentRevenue = async (): Promise<EquipmentRevenueMap> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('equipment_id, amount')
        .eq('status', 'completed');
      
      if (error) {
        console.error('Error fetching order revenue:', error);
        return {};
      }
      
      // Calculate total revenue per equipment from completed orders
      const revenueMap: EquipmentRevenueMap = {};
      (data || []).forEach(order => {
        if (order.equipment_id) {
          revenueMap[order.equipment_id] = (revenueMap[order.equipment_id] || 0) + (order.amount || 0);
        }
      });
      
      return revenueMap;
    } catch (err) {
      console.error('Error calculating equipment revenue:', err);
      return {};
    }
  };
  
  useEffect(() => {
    async function fetchEquipment() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch equipment and revenue data in parallel
        const [equipmentResult, revenueMap] = await Promise.all([
          (async () => {
            let query = supabase
              .from('equipment')
              .select('id, name, manufacturer, category, condition, status, location, description, image_url, model, specs, sales_option, price, lease_rate, pay_per_use_price, pay_per_use_enabled, usage_hours, downtime_hours, owner_id, created_at, updated_at, serial_number, sku, quantity, remote_control_enabled');
            
            // Filter by owner if provided
            if (options?.ownerId) {
              query = query.eq('owner_id', options.ownerId);
            }
            
            return query.order('created_at', { ascending: false });
          })(),
          fetchEquipmentRevenue()
        ]);
        
        const { data, error: queryError } = equipmentResult;
        
        if (queryError) {
          console.error('Supabase error:', queryError);
          throw queryError;
        }
        
        // Transform database data to match our EquipmentItem interface
        const formattedEquipment: EquipmentItem[] = (data || []).map(item => ({
          id: item.id,
          name: item.name || 'Unnamed Equipment',
          image_url: item.image_url || '/placeholder.svg',
          description: item.description || 'No description available',
          price: item.price || 0,
          category: item.category || 'Medical Device',
          manufacturer: item.manufacturer || 'Unknown',
          type: item.status?.toLowerCase() === 'available' ? 'available' : 
                item.status?.toLowerCase() === 'maintenance' ? 'maintenance' : 'in-use',
          location: item.location || 'Main Hospital',
          cluster: 'Hospital Network',
          pricePerUse: item.pay_per_use_price || 0,
          purchasePrice: item.price || 0,
          leaseRate: item.lease_rate || 0,
          nextAvailable: item.status !== 'available' ? '2025-06-01' : undefined,
          payPerUseEnabled: item.pay_per_use_enabled || false,
          payPerUsePrice: item.pay_per_use_price || 0,
          status: item.status,
          usageHours: item.usage_hours || 0,
          // Revenue calculated from actual completed orders
          revenueGenerated: revenueMap[item.id] || 0,
          ownerId: item.owner_id || undefined,
          // Fields needed for edit modal (snake_case for compatibility)
          model: item.model || '',
          serial_number: item.serial_number || '',
          sku: item.sku || '',
          condition: item.condition || '',
          specs: item.specs || '',
          quantity: item.quantity || 1,
          sales_option: item.sales_option || 'both',
          downtime_hours: item.downtime_hours || 0,
          remote_control_enabled: item.remote_control_enabled || false,
          pay_per_use_enabled: item.pay_per_use_enabled || false,
          pay_per_use_price: item.pay_per_use_price || null,
          lease_rate: item.lease_rate || null,
          owner_id: item.owner_id || null,
        }));
        
        setEquipment(formattedEquipment);
        
      } catch (err: any) {
        console.error('Error fetching equipment:', err);
        setError(err.message || 'Failed to load equipment');
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
  }, [options?.ownerId]);
  
  const refetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch equipment and revenue data in parallel
      const [equipmentResult, revenueMap] = await Promise.all([
        (async () => {
          let query = supabase
            .from('equipment')
            .select('id, name, manufacturer, category, condition, status, location, description, image_url, model, specs, sales_option, price, lease_rate, pay_per_use_price, pay_per_use_enabled, usage_hours, downtime_hours, owner_id, created_at, updated_at, serial_number, sku, quantity, remote_control_enabled');
          
          // Filter by owner if provided
          if (options?.ownerId) {
            query = query.eq('owner_id', options.ownerId);
          }
          
          return query.order('created_at', { ascending: false });
        })(),
        fetchEquipmentRevenue()
      ]);
      
      const { data, error: queryError } = equipmentResult;
        
      if (queryError) throw queryError;
      
      const formattedEquipment: EquipmentItem[] = (data || []).map(item => ({
        id: item.id,
        name: item.name || 'Unnamed Equipment',
        image_url: item.image_url || '/placeholder.svg',
        description: item.description || 'No description available',
        price: item.price || 0,
        category: item.category || 'Medical Device',
        manufacturer: item.manufacturer || 'Unknown',
        type: item.status?.toLowerCase() === 'available' ? 'available' : 
              item.status?.toLowerCase() === 'maintenance' ? 'maintenance' : 'in-use',
        location: item.location || 'Main Hospital',
        cluster: 'Hospital Network',
        pricePerUse: item.pay_per_use_price || 0,
        purchasePrice: item.price || 0,
        leaseRate: item.lease_rate || 0,
        nextAvailable: item.status !== 'available' ? '2025-06-01' : undefined,
        payPerUseEnabled: item.pay_per_use_enabled || false,
        payPerUsePrice: item.pay_per_use_price || 0,
        status: item.status,
        usageHours: item.usage_hours || 0,
        // Revenue calculated from actual completed orders
        revenueGenerated: revenueMap[item.id] || 0,
        ownerId: item.owner_id || undefined,
        // Fields needed for edit modal (snake_case for compatibility)
        model: item.model || '',
        serial_number: item.serial_number || '',
        sku: item.sku || '',
        condition: item.condition || '',
        specs: item.specs || '',
        quantity: item.quantity || 1,
        sales_option: item.sales_option || 'both',
        downtime_hours: item.downtime_hours || 0,
        remote_control_enabled: item.remote_control_enabled || false,
        pay_per_use_enabled: item.pay_per_use_enabled || false,
        pay_per_use_price: item.pay_per_use_price || null,
        lease_rate: item.lease_rate || null,
        owner_id: item.owner_id || null,
      }));
      
      setEquipment(formattedEquipment);
    } catch (err: any) {
      console.error('Error refetching equipment:', err);
      setError(err.message || 'Failed to refresh equipment');
    } finally {
      setLoading(false);
    }
  };

  return { 
    equipment, 
    loading, 
    error,
    refetchEquipment
  };
}
