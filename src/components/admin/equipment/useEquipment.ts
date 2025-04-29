
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createEquipmentImagesBucket } from '@/integrations/supabase/createStorageBucket';

interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  status: string;
  location: string;
}

export const useEquipment = (initialEquipment: Equipment[]) => {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [bucketReady, setBucketReady] = useState(false);
  const { toast } = useToast();

  // Create/check bucket when component mounts
  useEffect(() => {
    const checkBucket = async () => {
      const result = await createEquipmentImagesBucket();
      setBucketReady(result);
      if (!result) {
        toast({
          title: "Storage Setup Error",
          description: "Failed to set up image storage. Some features may not work correctly.",
          variant: "destructive",
        });
      }
    };
    
    checkBucket();
  }, []);

  // Fetch equipment data when refresh trigger changes
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const { data, error } = await supabase
          .from('equipment')
          .select('*');
          
        if (error) throw error;
        
        // Transform data for display - handle missing manufacturer field
        const formattedEquipment = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          // Use a fallback for manufacturer since it's not in the database schema
          manufacturer: item.category || 'Unknown', 
          status: item.status || 'Unknown',
          location: 'Warehouse' // Default location, update as needed
        }));
        
        setEquipment(formattedEquipment);
      } catch (error: any) {
        console.error('Error fetching equipment:', error);
        toast({
          title: "Error",
          description: "Failed to fetch equipment data",
          variant: "destructive",
        });
      }
    };
    
    fetchEquipment();
  }, [refreshTrigger]);

  const handleProductAdded = () => {
    // Increment trigger to refresh the equipment list
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Success",
      description: "Product added successfully", 
    });
  };

  const ensureBucketReady = async () => {
    if (!bucketReady) {
      const result = await createEquipmentImagesBucket();
      setBucketReady(result);
      return result;
    }
    return true;
  };

  return {
    equipment,
    bucketReady,
    handleProductAdded,
    ensureBucketReady
  };
};
