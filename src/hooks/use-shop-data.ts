
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Shop {
  id: string;
  name: string;
  country: string;
}

export const useShopData = (isAdmin = false, isOpen = false) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [shops, setShops] = useState<Array<Shop>>([]);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchShops = async () => {
    if (!isAdmin || !isOpen || !user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('manufacturer_shops')
        .select('id, name, country');
      
      if (error) throw error;
      
      setShops(data || []);
      if (data && data.length > 0) {
        setSelectedShop(data[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching shops:', error.message);
      toast({
        title: "Failed to load shops",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && isOpen && user) {
      fetchShops();
    }
  }, [isAdmin, isOpen, user]);

  return {
    shops,
    selectedShop,
    setSelectedShop,
    loading
  };
};
