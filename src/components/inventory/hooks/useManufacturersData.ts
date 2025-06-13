
import { useState, useEffect } from 'react';
import { Manufacturer } from '@/models/inventory';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useManufacturersData = (propManufacturers: Manufacturer[]) => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        setLoading(true);
        
        // Fetch all equipment to get manufacturer information
        const { data: equipmentData, error } = await supabase
          .from('equipment')
          .select('manufacturer, name, status, price, lease_rate');

        if (error) throw error;

        // Process data to create manufacturer list
        const manufacturerMap = new Map<string, {
          name: string;
          itemsLeased: number;
          totalEquipment: number;
          totalValue: number;
        }>();

        (equipmentData || []).forEach(equipment => {
          const manufacturerName = equipment.manufacturer || 'Unknown Manufacturer';
          
          if (!manufacturerMap.has(manufacturerName)) {
            manufacturerMap.set(manufacturerName, {
              name: manufacturerName,
              itemsLeased: 0,
              totalEquipment: 0,
              totalValue: 0,
            });
          }

          const manufacturerData = manufacturerMap.get(manufacturerName)!;
          manufacturerData.totalEquipment += 1;
          manufacturerData.totalValue += equipment.price || 0;
          
          // Count items that are in use or leased
          if (equipment.status === 'in-use' || equipment.status === 'leased') {
            manufacturerData.itemsLeased += 1;
          }
        });

        // Convert to manufacturer array
        const manufacturersList: Manufacturer[] = Array.from(manufacturerMap.entries()).map(([name, data], index) => ({
          id: `mfg-${index}`,
          name: name,
          logo: '/placeholder-logo.png',
          contactPerson: 'Contact Manager',
          email: `contact@${name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
          phone: `+254 ${(700000000 + Math.floor(Math.random() * 99999999)).toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`,
          itemsLeased: data.itemsLeased
        }));

        setManufacturers(manufacturersList);

      } catch (error: any) {
        console.error('Error fetching manufacturers:', error);
        toast({
          title: "Error loading manufacturers",
          description: error.message || "Failed to load manufacturer data",
          variant: "destructive",
        });
        // Fallback to prop data if available
        setManufacturers(propManufacturers);
      } finally {
        setLoading(false);
      }
    };

    fetchManufacturers();
  }, [propManufacturers, toast]);

  return { manufacturers, loading };
};
