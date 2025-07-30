import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  FileText, 
  DollarSign, 
  User, 
  Wrench,
  Eye,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface EquipmentMaintenanceHistoryProps {
  equipmentId: string;
  equipmentName?: string;
}

interface MaintenanceRecord {
  id: string;
  scheduled_date: string;
  completed_date?: string;
  status: string;
  description?: string;
  maintenance_type: string;
  priority: string;
  technician_name?: string;
  technician_notes?: string;
  estimated_duration: number;
  actual_duration?: number;
  cost?: number;
  created_at: string;
}

const EquipmentMaintenanceHistory: React.FC<EquipmentMaintenanceHistoryProps> = ({
  equipmentId,
  equipmentName
}) => {
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMaintenanceHistory();
  }, [equipmentId]);

  const fetchMaintenanceHistory = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('maintenance')
        .select('*')
        .eq('equipment_id', equipmentId)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;

      setMaintenanceHistory(data || []);
    } catch (error) {
      console.error('Error fetching maintenance history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch maintenance history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaintenanceTypeIcon = (type: string) => {
    switch (type) {
      case 'preventive': return <Calendar className="h-4 w-4" />;
      case 'corrective': return <Wrench className="h-4 w-4" />;
      case 'calibration': return <Clock className="h-4 w-4" />;
      case 'inspection': return <Eye className="h-4 w-4" />;
      case 'repair': return <AlertTriangle className="h-4 w-4" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (record: MaintenanceRecord) => {
    setSelectedRecord(record);
    setDetailsModalOpen(true);
  };

  const getMaintenanceStats = () => {
    const total = maintenanceHistory.length;
    const completed = maintenanceHistory.filter(m => m.status === 'completed').length;
    const totalCost = maintenanceHistory
      .filter(m => m.cost)
      .reduce((sum, m) => sum + (m.cost || 0), 0);
    const avgDuration = maintenanceHistory
      .filter(m => m.actual_duration)
      .reduce((sum, m, _, arr) => sum + (m.actual_duration || 0) / arr.length, 0);

    return { total, completed, totalCost, avgDuration };
  };

  const stats = getMaintenanceStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Maintenance</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${stats.totalCost.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.avgDuration.toFixed(1)}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#333333] flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Maintenance History {equipmentName && `- ${equipmentName}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading maintenance history...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No maintenance history found for this equipment
                    </TableCell>
                  </TableRow>
                ) : (
                  maintenanceHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <div>
                            <p className="text-sm">
                              {format(parseISO(record.scheduled_date), 'MMM dd, yyyy')}
                            </p>
                            {record.completed_date && (
                              <p className="text-xs text-gray-500">
                                Completed: {format(parseISO(record.completed_date), 'MMM dd')}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getMaintenanceTypeIcon(record.maintenance_type)}
                          <span className="text-sm">
                            {record.maintenance_type.replace('_', ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(record.priority)}>
                          {record.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3 text-gray-500" />
                          <span className="text-sm">
                            {record.technician_name || 'Unassigned'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-sm">
                            {record.actual_duration || record.estimated_duration}h
                            {record.actual_duration && record.actual_duration !== record.estimated_duration && (
                              <span className="text-xs text-gray-500 ml-1">
                                (est. {record.estimated_duration}h)
                              </span>
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.cost ? (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3 text-gray-500" />
                            <span className="text-sm">${record.cost.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(record)}
                          className="border-[#E02020] text-[#E02020] hover:bg-red-50"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Maintenance Details</DialogTitle>
            <DialogDescription>
              {selectedRecord && format(parseISO(selectedRecord.scheduled_date), 'PPPP')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span>{selectedRecord.maintenance_type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <Badge className={getPriorityColor(selectedRecord.priority)}>
                        {selectedRecord.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedRecord.status)}>
                        {selectedRecord.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Technician:</span>
                      <span>{selectedRecord.technician_name || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Timeline & Cost</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Scheduled:</span>
                      <span>{format(parseISO(selectedRecord.scheduled_date), 'PPp')}</span>
                    </div>
                    {selectedRecord.completed_date && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span>{format(parseISO(selectedRecord.completed_date), 'PPp')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>
                        {selectedRecord.actual_duration || selectedRecord.estimated_duration}h
                        {selectedRecord.actual_duration && selectedRecord.actual_duration !== selectedRecord.estimated_duration && (
                          <span className="text-gray-500 ml-1">
                            (est. {selectedRecord.estimated_duration}h)
                          </span>
                        )}
                      </span>
                    </div>
                    {selectedRecord.cost && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost:</span>
                        <span>${selectedRecord.cost.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedRecord.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedRecord.description}
                  </p>
                </div>
              )}

              {selectedRecord.technician_notes && (
                <div>
                  <h4 className="font-semibold mb-2">Technician Notes</h4>
                  <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                    {selectedRecord.technician_notes}
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipmentMaintenanceHistory;