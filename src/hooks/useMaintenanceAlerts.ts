
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceAlert {
  id: string;
  equipment_id?: string;
  equipment_name: string;
  location: string;
  issue_type: 'calibration_overdue' | 'preventive_maintenance' | 'error_codes' | 'inspection_required' | 'repair_needed';
  issue_description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'scheduled' | 'in_progress' | 'resolved';
  last_service_date?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  scheduled_maintenance_date?: string;
}

export const useMaintenanceAlerts = () => {
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredAlerts, setFilteredAlerts] = useState<MaintenanceAlert[]>([]);
  const { toast } = useToast();

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type assertion to ensure proper typing from database
      const typedData = (data || []).map((alert: any) => ({
        ...alert,
        issue_type: alert.issue_type as MaintenanceAlert['issue_type'],
        urgency: alert.urgency as MaintenanceAlert['urgency'],
        status: alert.status as MaintenanceAlert['status']
      }));

      setAlerts(typedData);
      setFilteredAlerts(typedData);
    } catch (error: any) {
      console.error('Error fetching maintenance alerts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch maintenance alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAlertStatus = async (alertId: string, status: string, scheduledDate?: string) => {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      if (scheduledDate) {
        updateData.scheduled_maintenance_date = scheduledDate;
      }
      
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('maintenance_alerts')
        .update(updateData)
        .eq('id', alertId);

      if (error) throw error;

      await fetchAlerts();
      
      toast({
        title: "Success",
        description: "Alert status updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating alert status:', error);
      toast({
        title: "Error",
        description: "Failed to update alert status",
        variant: "destructive",
      });
    }
  };

  const filterAlerts = (filters: {
    location?: string;
    issueType?: string;
    urgency?: string;
    status?: string;
    searchTerm?: string;
  }) => {
    let filtered = [...alerts];

    if (filters.location) {
      filtered = filtered.filter(alert => alert.location === filters.location);
    }

    if (filters.issueType) {
      filtered = filtered.filter(alert => alert.issue_type === filters.issueType);
    }

    if (filters.urgency) {
      filtered = filtered.filter(alert => alert.urgency === filters.urgency);
    }

    if (filters.status) {
      filtered = filtered.filter(alert => alert.status === filters.status);
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(alert => 
        alert.equipment_name.toLowerCase().includes(searchLower) ||
        alert.issue_description.toLowerCase().includes(searchLower) ||
        alert.location.toLowerCase().includes(searchLower)
      );
    }

    setFilteredAlerts(filtered);
  };

  const getAlertCounts = () => {
    const pending = alerts.filter(alert => alert.status === 'pending').length;
    const critical = alerts.filter(alert => alert.urgency === 'critical' && alert.status !== 'resolved').length;
    const high = alerts.filter(alert => alert.urgency === 'high' && alert.status !== 'resolved').length;
    
    return { pending, critical, high, total: alerts.length };
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return {
    alerts: filteredAlerts,
    loading,
    refreshAlerts: fetchAlerts,
    updateAlertStatus,
    filterAlerts,
    getAlertCounts
  };
};
