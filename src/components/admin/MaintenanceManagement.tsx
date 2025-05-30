
import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, X, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import MaintenanceAlertsSection from './maintenance/MaintenanceAlertsSection';
import ScheduleMaintenanceModal from './maintenance/ScheduleMaintenanceModal';
import EditMaintenanceModal from './maintenance/EditMaintenanceModal';

interface Maintenance {
  id: string;
  equipment_id?: string;
  scheduled_date: string;
  status: string;
  description: string;
  completed_date?: string;
  created_by?: string;
  equipment?: {
    name: string;
    location?: string;
  };
}

interface MaintenanceManagementProps {
  maintenanceSchedule?: Maintenance[];
  maintenanceAlerts?: number;
}

const MaintenanceManagement = ({ maintenanceSchedule: propSchedule, maintenanceAlerts }: MaintenanceManagementProps) => {
  const [maintenanceSchedule, setMaintenanceSchedule] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const { toast } = useToast();

  // Safe date formatting function
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const fetchMaintenanceSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance')
        .select(`
          *,
          equipment:equipment_id (
            name,
            location
          )
        `)
        .in('status', ['scheduled', 'in_progress'])
        .order('scheduled_date', { ascending: true });

      if (error) throw error;

      setMaintenanceSchedule(data || []);
    } catch (error: any) {
      console.error('Error fetching maintenance schedule:', error);
      toast({
        title: "Error",
        description: "Failed to fetch maintenance schedule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propSchedule) {
      setMaintenanceSchedule(propSchedule);
      setLoading(false);
    } else {
      fetchMaintenanceSchedule();
    }

    // Set up real-time subscription for maintenance updates
    const channel = supabase
      .channel('maintenance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance'
        },
        (payload) => {
          console.log('Maintenance change:', payload);
          fetchMaintenanceSchedule();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propSchedule]);

  const handleCancelMaintenance = async (maintenanceId: string) => {
    try {
      const { error } = await supabase
        .from('maintenance')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', maintenanceId);

      if (error) throw error;

      await fetchMaintenanceSchedule();
      
      toast({
        title: "Success",
        description: "Maintenance cancelled successfully",
      });
    } catch (error: any) {
      console.error('Error cancelling maintenance:', error);
      toast({
        title: "Error",
        description: "Failed to cancel maintenance",
        variant: "destructive",
      });
    }
  };

  const handleEditMaintenance = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setEditModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaintenanceType = (description: string | null | undefined) => {
    if (!description) return 'Maintenance';
    
    const desc = description.toLowerCase();
    if (desc.includes('preventive')) return 'Preventive';
    if (desc.includes('calibration')) return 'Calibration';
    if (desc.includes('repair')) return 'Repair';
    if (desc.includes('inspection')) return 'Inspection';
    return 'Maintenance';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Preventive': return 'bg-green-100 text-green-800';
      case 'Calibration': return 'bg-blue-100 text-blue-800';
      case 'Repair': return 'bg-red-100 text-red-800';
      case 'Inspection': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#333333]">Maintenance Management</h2>
        <Button
          onClick={() => setScheduleModalOpen(true)}
          className="bg-[#E02020] hover:bg-[#c01010] text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </Button>
      </div>
      
      <MaintenanceAlertsSection />
      
      <h3 className="text-lg font-semibold mb-4 text-[#333333]">Upcoming Maintenance Schedule</h3>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-pulse">Loading maintenance schedule...</div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceSchedule.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No maintenance scheduled
                </TableCell>
              </TableRow>
            ) : (
              maintenanceSchedule.map((item) => {
                const type = getMaintenanceType(item.description);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{item.equipment?.name || 'Unknown Equipment'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span>{item.equipment?.location || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{formatDate(item.scheduled_date)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(type)}>
                        {type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditMaintenance(item)}
                          className="border-[#E02020] text-[#E02020] hover:bg-red-50"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelMaintenance(item.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}

      <ScheduleMaintenanceModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        onScheduled={() => {
          setScheduleModalOpen(false);
          fetchMaintenanceSchedule();
        }}
      />

      <EditMaintenanceModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        maintenance={selectedMaintenance}
        onUpdated={() => {
          setEditModalOpen(false);
          setSelectedMaintenance(null);
          fetchMaintenanceSchedule();
        }}
      />
    </div>
  );
};

export default MaintenanceManagement;
