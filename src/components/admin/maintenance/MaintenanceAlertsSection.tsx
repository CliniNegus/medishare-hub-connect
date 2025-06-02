import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Wrench, Eye, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import ScheduleMaintenanceModal from './ScheduleMaintenanceModal';

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

// Type for raw data from Supabase
interface RawMaintenanceAlert {
  id: string;
  equipment_id?: string;
  equipment_name: string;
  location: string;
  issue_type: string;
  issue_description: string;
  urgency: string;
  status: string;
  last_service_date?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  scheduled_maintenance_date?: string;
}

const MaintenanceAlertsSection = () => {
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<MaintenanceAlert | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper function to safely convert raw data to typed alerts
  const convertToMaintenanceAlert = (rawAlert: RawMaintenanceAlert): MaintenanceAlert => {
    // Define valid values for each enum field
    const validIssueTypes = ['calibration_overdue', 'preventive_maintenance', 'error_codes', 'inspection_required', 'repair_needed'];
    const validUrgencies = ['low', 'medium', 'high', 'critical'];
    const validStatuses = ['pending', 'scheduled', 'in_progress', 'resolved'];

    return {
      ...rawAlert,
      issue_type: validIssueTypes.includes(rawAlert.issue_type) 
        ? rawAlert.issue_type as MaintenanceAlert['issue_type']
        : 'repair_needed', // fallback
      urgency: validUrgencies.includes(rawAlert.urgency)
        ? rawAlert.urgency as MaintenanceAlert['urgency']
        : 'medium', // fallback
      status: validStatuses.includes(rawAlert.status)
        ? rawAlert.status as MaintenanceAlert['status']
        : 'pending' // fallback
    };
  };

  const fetchMaintenanceAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_alerts')
        .select('*')
        .neq('status', 'resolved')
        .order('urgency', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert raw data to properly typed alerts
      const typedAlerts = (data || []).map(convertToMaintenanceAlert);
      setAlerts(typedAlerts);
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

  useEffect(() => {
    fetchMaintenanceAlerts();

    // Set up real-time subscription for maintenance alerts
    const channel = supabase
      .channel('maintenance_alerts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_alerts'
        },
        (payload) => {
          console.log('Maintenance alert change:', payload);
          fetchMaintenanceAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getAlertCounts = () => {
    const pending = alerts.filter(alert => alert.status === 'pending').length;
    const critical = alerts.filter(alert => alert.urgency === 'critical').length;
    const high = alerts.filter(alert => alert.urgency === 'high').length;
    
    return { pending, critical, high, total: alerts.length };
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIssueIcon = (issueType: string) => {
    switch (issueType) {
      case 'calibration_overdue': return <Clock className="h-4 w-4" />;
      case 'error_codes': return <AlertTriangle className="h-4 w-4" />;
      case 'repair_needed': return <Wrench className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatIssueType = (issueType: string) => {
    return issueType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleScheduleMaintenance = (alert: MaintenanceAlert) => {
    setSelectedAlert(alert);
    setScheduleModalOpen(true);
  };

  const handleViewAllAlerts = () => {
    navigate('/admin/maintenance-alerts');
  };

  const alertCounts = getAlertCounts();

  if (loading) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
        <div className="animate-pulse">Loading maintenance alerts...</div>
      </div>
    );
  }

  const criticalAlerts = alerts.filter(alert => 
    (alert.urgency === 'critical' || alert.urgency === 'high') && alert.status === 'pending'
  );

  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-[#333333]">Maintenance Alerts</h3>
        
        {alerts.length === 0 ? (
          <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-4">
            <h4 className="font-semibold text-green-700 mb-2 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              No Active Maintenance Alerts
            </h4>
            <p className="text-green-600 mb-3">All equipment is operating normally. No immediate maintenance required.</p>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewAllAlerts}
                className="border-[#E02020] text-[#E02020] hover:bg-red-50"
              >
                <Eye className="h-4 w-4 mr-1" />
                View All Alerts
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setScheduleModalOpen(true)}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Schedule Maintenance
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
            <h4 className="font-semibold text-yellow-700 mb-2 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Equipment Requiring Immediate Attention: {alertCounts.critical + alertCounts.high}
            </h4>
            <p className="text-yellow-600 mb-3">The following equipment items require immediate maintenance:</p>
            
            <div className="space-y-2 mb-4">
              {criticalAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    {getIssueIcon(alert.issue_type)}
                    <div>
                      <span className="font-medium text-gray-900">{alert.equipment_name}</span>
                      <span className="text-gray-600 ml-2">({alert.location})</span>
                      <div className="text-sm text-gray-500">{alert.issue_description}</div>
                      <div className="text-xs text-gray-400">{formatIssueType(alert.issue_type)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getUrgencyColor(alert.urgency)}>
                      {alert.urgency.toUpperCase()}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleScheduleMaintenance(alert)}
                      className="border-[#E02020] text-[#E02020] hover:bg-red-50"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
              
              {criticalAlerts.length > 3 && (
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500">
                    And {criticalAlerts.length - 3} more alert{criticalAlerts.length - 3 > 1 ? 's' : ''}...
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewAllAlerts}
                className="border-[#E02020] text-[#E02020] hover:bg-red-50"
              >
                <Eye className="h-4 w-4 mr-1" />
                View All Alerts ({alertCounts.total})
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setScheduleModalOpen(true)}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Schedule Maintenance
              </Button>
            </div>
          </div>
        )}
      </div>

      <ScheduleMaintenanceModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        selectedAlert={selectedAlert}
        onScheduled={() => {
          setScheduleModalOpen(false);
          setSelectedAlert(null);
          fetchMaintenanceAlerts();
        }}
      />
    </>
  );
};

export default MaintenanceAlertsSection;
