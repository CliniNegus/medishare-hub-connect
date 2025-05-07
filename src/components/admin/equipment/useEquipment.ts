
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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Create/check bucket when component mounts
  useEffect(() => {
    const checkBucket = async () => {
      const result = await createEquipmentImagesBucket();
      setBucketReady(result);
      if (!result) {
        console.error("Failed to setup equipment images storage bucket");
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
        setLoading(true);
        console.log("Fetching equipment data...");
        
        const { data, error } = await supabase
          .from('equipment')
          .select('*');
          
        if (error) throw error;
        
        console.log("Equipment data fetched:", data?.length || 0, "items");
        
        // Transform data for display - handle missing manufacturer field
        const formattedEquipment = (data || []).map(item => ({
          id: item.id,
          name: item.name || "Unnamed Equipment",
          manufacturer: item.manufacturer || item.category || 'Unknown', 
          status: item.status || 'Unknown',
          location: item.location || 'Warehouse' // Default location
        }));
        
        setEquipment(formattedEquipment);
      } catch (error: any) {
        console.error('Error fetching equipment:', error);
        toast({
          title: "Error",
          description: "Failed to fetch equipment data: " + error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
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
    loading,
    bucketReady,
    handleProductAdded,
    ensureBucketReady,
    refreshEquipment: () => setRefreshTrigger(prev => prev + 1)
  };
};
