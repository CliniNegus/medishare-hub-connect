import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EnhancedMaintenance {
  id: string;
  equipment_id?: string;
  scheduled_date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  description?: string;
  completed_date?: string;
  created_by?: string;
  technician_name?: string;
  technician_notes?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  maintenance_type: 'preventive' | 'corrective' | 'calibration' | 'inspection' | 'repair';
  estimated_duration: number;
  actual_duration?: number;
  cost?: number;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
  equipment?: {
    name: string;
    location?: string;
    image_url?: string;
    serial_number?: string;
  };
}

export interface MaintenanceFilters {
  equipment?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string;
  priority?: string;
  maintenance_type?: string;
  is_overdue?: boolean;
}

export const useEnhancedMaintenance = () => {
  const [maintenance, setMaintenance] = useState<EnhancedMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MaintenanceFilters>({});
  const { toast } = useToast();

  const fetchMaintenance = async (currentFilters?: MaintenanceFilters) => {
    try {
      setLoading(true);
      const filtersToUse = currentFilters || filters;
      
      let query = supabase
        .from('maintenance')
        .select(`
          *,
          equipment:equipment_id (
            name,
            location,
            image_url,
            serial_number
          )
        `)
        .order('scheduled_date', { ascending: false });

      // Apply filters
      if (filtersToUse.equipment) {
        query = query.eq('equipment_id', filtersToUse.equipment);
      }
      
      if (filtersToUse.status) {
        query = query.eq('status', filtersToUse.status);
      }
      
      if (filtersToUse.priority) {
        query = query.eq('priority', filtersToUse.priority);
      }
      
      if (filtersToUse.maintenance_type) {
        query = query.eq('maintenance_type', filtersToUse.maintenance_type);
      }
      
      if (filtersToUse.is_overdue === true) {
        query = query.eq('is_overdue', true);
      }
      
      if (filtersToUse.dateRange) {
        query = query
          .gte('scheduled_date', filtersToUse.dateRange.start)
          .lte('scheduled_date', filtersToUse.dateRange.end);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Type assertion to ensure proper typing from database
      const typedData = (data || []).map((item: any) => ({
        ...item,
        status: item.status as EnhancedMaintenance['status'],
        priority: item.priority as EnhancedMaintenance['priority'],
        maintenance_type: item.maintenance_type as EnhancedMaintenance['maintenance_type'],
      }));
      
      setMaintenance(typedData);
    } catch (error: any) {
      console.error('Error fetching maintenance:', error);
      toast({
        title: "Error",
        description: "Failed to fetch maintenance records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMaintenance = async (maintenanceData: {
    equipment_id: string;
    scheduled_date: string;
    maintenance_type: string;
    priority: string;
    description?: string;
    estimated_duration?: number;
    technician_name?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('maintenance')
        .insert({
          ...maintenanceData,
          status: 'scheduled',
          created_by: (await supabase.auth.getUser()).data.user?.id,
          estimated_duration: maintenanceData.estimated_duration || 2,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchMaintenance();
      
      toast({
        title: "Success",
        description: "Maintenance scheduled successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating maintenance:', error);
      toast({
        title: "Error",
        description: "Failed to schedule maintenance",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateMaintenance = async (
    maintenanceId: string, 
    updates: Partial<EnhancedMaintenance>
  ) => {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // If marking as completed, set completion date
      if (updates.status === 'completed' && !updates.completed_date) {
        updateData.completed_date = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('maintenance')
        .update(updateData)
        .eq('id', maintenanceId)
        .select()
        .single();

      if (error) throw error;

      await fetchMaintenance();
      
      toast({
        title: "Success",
        description: "Maintenance updated successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error updating maintenance:', error);
      toast({
        title: "Error",
        description: "Failed to update maintenance",
        variant: "destructive",
      });
      throw error;
    }
  };

  const markAsCompleted = async (
    maintenanceId: string,
    completionData: {
      technician_notes?: string;
      actual_duration?: number;
      cost?: number;
    }
  ) => {
    return updateMaintenance(maintenanceId, {
      status: 'completed',
      completed_date: new Date().toISOString(),
      ...completionData,
    });
  };

  const getMaintenanceStats = () => {
    const total = maintenance.length;
    const scheduled = maintenance.filter(m => m.status === 'scheduled').length;
    const inProgress = maintenance.filter(m => m.status === 'in_progress').length;
    const completed = maintenance.filter(m => m.status === 'completed').length;
    const overdue = maintenance.filter(m => m.is_overdue).length;
    const critical = maintenance.filter(m => m.priority === 'critical').length;
    
    return {
      total,
      scheduled,
      inProgress,
      completed,
      overdue,
      critical,
    };
  };

  const checkOverdueMaintenance = async () => {
    try {
      const { error } = await supabase.rpc('mark_overdue_maintenance');
      if (error) throw error;
      
      await fetchMaintenance();
    } catch (error: any) {
      console.error('Error checking overdue maintenance:', error);
    }
  };

  useEffect(() => {
    fetchMaintenance();
    
    // Check for overdue maintenance every 5 minutes
    const overdueInterval = setInterval(checkOverdueMaintenance, 5 * 60 * 1000);
    
    // Set up real-time subscription
    const channel = supabase
      .channel('maintenance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance'
        },
        () => {
          fetchMaintenance();
        }
      )
      .subscribe();

    return () => {
      clearInterval(overdueInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    maintenance,
    loading,
    filters,
    setFilters,
    fetchMaintenance,
    createMaintenance,
    updateMaintenance,
    markAsCompleted,
    getMaintenanceStats,
    checkOverdueMaintenance,
  };
};