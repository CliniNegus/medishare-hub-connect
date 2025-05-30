
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface TrackingEquipment {
  id: string;
  name: string;
  category: string;
  status: string;
  location: string;
  image_url?: string;
  usage_hours: number;
  downtime_hours: number;
  remote_control_enabled: boolean;
  updated_at: string;
}

interface EquipmentAnalytics {
  id: string;
  equipment_id: string;
  usage_hours: number;
  downtime_hours: number;
  revenue_generated: number;
  date_recorded: string;
  last_location: string;
}

export const useRealTimeTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [equipmentList, setEquipmentList] = useState<TrackingEquipment[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('');
  const [analytics, setAnalytics] = useState<EquipmentAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEquipment = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      const trackingEquipment = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category || 'Unknown',
        status: item.status || 'Available',
        location: item.location || 'Unknown Location',
        image_url: item.image_url,
        usage_hours: item.usage_hours || 0,
        downtime_hours: item.downtime_hours || 0,
        remote_control_enabled: item.remote_control_enabled || false,
        updated_at: item.updated_at
      }));

      setEquipmentList(trackingEquipment);
      
      if (trackingEquipment.length > 0 && !selectedEquipmentId) {
        setSelectedEquipmentId(trackingEquipment[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching equipment:', error);
      toast({
        variant: "destructive",
        title: "Error fetching equipment",
        description: error.message,
      });
    }
  };

  const fetchAnalytics = async (equipmentId: string) => {
    if (!equipmentId) return;

    try {
      const { data, error } = await supabase
        .from('equipment_analytics')
        .select('*')
        .eq('equipment_id', equipmentId)
        .order('date_recorded', { ascending: false })
        .limit(30);

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await fetchEquipment();
    if (selectedEquipmentId) {
      await fetchAnalytics(selectedEquipmentId);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  useEffect(() => {
    if (selectedEquipmentId) {
      fetchAnalytics(selectedEquipmentId);
    }
  }, [selectedEquipmentId]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const equipmentChannel = supabase
      .channel('equipment-tracking-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipment',
          filter: `owner_id=eq.${user.id}`
        },
        () => {
          console.log('Equipment data changed, refreshing...');
          fetchEquipment();
        }
      )
      .subscribe();

    const analyticsChannel = supabase
      .channel('analytics-tracking-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipment_analytics'
        },
        () => {
          console.log('Analytics data changed, refreshing...');
          if (selectedEquipmentId) {
            fetchAnalytics(selectedEquipmentId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(equipmentChannel);
      supabase.removeChannel(analyticsChannel);
    };
  }, [user, selectedEquipmentId]);

  return {
    equipmentList,
    selectedEquipmentId,
    setSelectedEquipmentId,
    analytics,
    loading,
    refetch: fetchAllData
  };
};
