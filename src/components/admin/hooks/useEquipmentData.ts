
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  status: string;
  location: string;
}

export const useEquipmentData = (activeTab: string, initialEquipment: Equipment[]) => {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);

  useEffect(() => {
    if (activeTab === 'equipment') {
      // Fetch latest equipment data when tab is equipment
      const fetchEquipment = async () => {
        try {
          const { data } = await supabase
            .from('equipment')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);
          
          if (data) {
            const formattedData = data.map(item => ({
              id: item.id,
              name: item.name || 'Unnamed Equipment',
              manufacturer: item.manufacturer || item.category || 'Unknown Manufacturer',
              status: item.status || 'Available',
              location: item.location || 'Warehouse'
            }));
            
            setEquipment(formattedData);
          }
        } catch (error) {
          console.error('Error fetching equipment:', error);
        }
      };
      
      fetchEquipment();

      // Set up real-time subscription for equipment tab
      const channel = supabase
        .channel('admin-equipment-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment' }, () => {
          fetchEquipment();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // Use initial equipment data for overview tab
      setEquipment(initialEquipment);
    }
  }, [activeTab, initialEquipment]);

  return { equipment };
};
