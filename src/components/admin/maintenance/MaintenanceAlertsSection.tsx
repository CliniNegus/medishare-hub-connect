
import React, { useState } from 'react';
import { AlertTriangle, Clock, Wrench, Eye, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMaintenanceAlerts } from '@/hooks/useMaintenanceAlerts';
import { useNavigate } from 'react-router-dom';
import ScheduleMaintenanceModal from './ScheduleMaintenanceModal';

const MaintenanceAlertsSection = () => {
  const { alerts, loading, getAlertCounts, updateAlertStatus } = useMaintenanceAlerts();
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const navigate = useNavigate();
  const alertCounts = getAlertCounts();

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

  const handleScheduleMaintenance = (alert: any) => {
    setSelectedAlert(alert);
    setScheduleModalOpen(true);
  };

  const handleViewAllAlerts = () => {
    navigate('/admin/maintenance-alerts');
  };

  if (loading) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
        <div className="animate-pulse">Loading maintenance alerts...</div>
      </div>
    );
  }

  const criticalAlerts = alerts.filter(alert => 
    alert.urgency === 'critical' && alert.status === 'pending'
  );

  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-[#333333]">Maintenance Alerts</h3>
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
      </div>

      <ScheduleMaintenanceModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        selectedAlert={selectedAlert}
        onScheduled={() => {
          setScheduleModalOpen(false);
          setSelectedAlert(null);
        }}
      />
    </>
  );
};

export default MaintenanceAlertsSection;
