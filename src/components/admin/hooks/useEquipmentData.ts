
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
            .limit(10);
          
          if (data) {
            const formattedData = data.map(item => ({
              id: item.id,
              name: item.name,
              // Use category as manufacturer since manufacturer field doesn't exist
              manufacturer: item.category || 'Unknown',
              status: item.status || 'Unknown',
              location: 'Warehouse' // Default location
            }));
            
            setEquipment(formattedData);
          }
        } catch (error) {
          console.error('Error fetching equipment:', error);
        }
      };
      
      fetchEquipment();
    }
  }, [activeTab]);

  return { equipment };
};
