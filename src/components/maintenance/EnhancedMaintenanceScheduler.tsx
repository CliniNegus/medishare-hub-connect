import React, { useState, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CalendarDays,
  Clock,
  FileText,
  AlertTriangle,
  Settings,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  Eye,
  Calendar as CalendarIcon,
  Wrench,
  Bell,
  TrendingUp,
} from "lucide-react";
import { useEnhancedMaintenance, MaintenanceFilters } from '@/hooks/useEnhancedMaintenance';
import { useEquipmentManagement } from '@/hooks/useEquipmentManagement';
import { formatDistanceToNow, format, parseISO, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceCompletionModalProps {
  maintenance: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (completionData: any) => void;
}

const MaintenanceCompletionModal: React.FC<MaintenanceCompletionModalProps> = ({
  maintenance,
  open,
  onOpenChange,
  onComplete
}) => {
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [actualDuration, setActualDuration] = useState('');
  const [cost, setCost] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!technicianNotes.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onComplete({
        technician_notes: technicianNotes,
        actual_duration: actualDuration ? parseInt(actualDuration) : undefined,
        cost: cost ? parseFloat(cost) : undefined,
      });
      
      // Reset form
      setTechnicianNotes('');
      setActualDuration('');
      setCost('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error completing maintenance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Maintenance</DialogTitle>
          <DialogDescription>
            Mark maintenance as completed for {maintenance?.equipment?.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="technician-notes">Technician Notes *</Label>
            <Textarea
              id="technician-notes"
              placeholder="Describe the work performed, any issues found, recommendations..."
              value={technicianNotes}
              onChange={(e) => setTechnicianNotes(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="actual-duration">Actual Duration (hours)</Label>
            <Input
              id="actual-duration"
              type="number"
              placeholder="e.g., 3"
              value={actualDuration}
              onChange={(e) => setActualDuration(e.target.value)}
              min="0"
              step="0.5"
            />
          </div>
          
          <div>
            <Label htmlFor="cost">Total Cost</Label>
            <Input
              id="cost"
              type="number"
              placeholder="e.g., 150.00"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              disabled={!technicianNotes.trim() || loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Completing...' : 'Mark Complete'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EnhancedMaintenanceScheduler: React.FC = () => {
  const { toast } = useToast();
  const { equipment, loading: equipmentLoading } = useEquipmentManagement();
  const {
    maintenance,
    loading,
    filters,
    setFilters,
    createMaintenance,
    updateMaintenance,
    markAsCompleted,
    getMaintenanceStats,
  } = useEnhancedMaintenance();

  // Form state
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('preventive');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('2');
  const [technicianName, setTechnicianName] = useState('');
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('schedule');

  const stats = useMemo(() => getMaintenanceStats(), [maintenance]);

  const handleScheduleMaintenance = async () => {
    if (!selectedEquipmentId || !date) {
      toast({
        title: "Validation Error",
        description: "Please select equipment and date",
        variant: "destructive"
      });
      return;
    }

    try {
      await createMaintenance({
        equipment_id: selectedEquipmentId,
        scheduled_date: date.toISOString(),
        maintenance_type: maintenanceType,
        priority,
        description: description || undefined,
        estimated_duration: parseInt(estimatedDuration),
        technician_name: technicianName || undefined,
      });

      // Reset form
      setSelectedEquipmentId('');
      setDescription('');
      setTechnicianName('');
      setDate(addDays(new Date(), 1));
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleCompleteMaintenanceClick = (maintenanceItem: any) => {
    setSelectedMaintenance(maintenanceItem);
    setCompletionModalOpen(true);
  };

  const handleCompleteMaintenance = async (completionData: any) => {
    if (!selectedMaintenance) return;
    
    try {
      await markAsCompleted(selectedMaintenance.id, completionData);
    } catch (error) {
      // Error handled in hook
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
      case 'preventive': return <CalendarIcon className="h-4 w-4" />;
      case 'corrective': return <Wrench className="h-4 w-4" />;
      case 'calibration': return <Settings className="h-4 w-4" />;
      case 'inspection': return <Eye className="h-4 w-4" />;
      case 'repair': return <AlertTriangle className="h-4 w-4" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  const applyFilters = (newFilters: MaintenanceFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({});
  };

  const filteredMaintenance = useMemo(() => {
    return maintenance.filter(item => {
      if (filters.equipment && item.equipment_id !== filters.equipment) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.priority && item.priority !== filters.priority) return false;
      if (filters.maintenance_type && item.maintenance_type !== filters.maintenance_type) return false;
      if (filters.is_overdue === true && !item.is_overdue) return false;
      
      if (filters.dateRange) {
        const scheduleDate = parseISO(item.scheduled_date);
        const startDate = parseISO(filters.dateRange.start);
        const endDate = parseISO(filters.dateRange.end);
        if (scheduleDate < startDate || scheduleDate > endDate) return false;
      }
      
      return true;
    });
  }, [maintenance, filters]);

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-orange-600">{stats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wrench className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200">
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
        
        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-purple-600">{stats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger 
            value="schedule" 
            className="data-[state=active]:bg-[#E02020] data-[state=active]:text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger 
            value="maintenance" 
            className="data-[state=active]:bg-[#E02020] data-[state=active]:text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-[#E02020] data-[state=active]:text-white"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Schedule Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-[#E02020] flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2" />
                  Schedule Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="equipment">Equipment *</Label>
                  <Select value={selectedEquipmentId} onValueChange={setSelectedEquipmentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipment.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} - {item.location || 'No location'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Scheduled Date *</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md"
                    disabled={(date) => date < new Date()}
                  />
                </div>

                <div>
                  <Label htmlFor="maintenance-type">Maintenance Type</Label>
                  <Select value={maintenanceType} onValueChange={setMaintenanceType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventive">Preventive Maintenance</SelectItem>
                      <SelectItem value="corrective">Corrective Maintenance</SelectItem>
                      <SelectItem value="calibration">Calibration</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="critical">Critical Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Estimated Duration (hours)</Label>
                  <Select value={estimatedDuration} onValueChange={setEstimatedDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="12">12 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="technician">Technician Name</Label>
                  <Input
                    id="technician"
                    placeholder="Assigned technician"
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Maintenance details and instructions"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-24"
                  />
                </div>

                <Button
                  onClick={handleScheduleMaintenance}
                  className="w-full bg-[#E02020] hover:bg-[#c01010] text-white"
                  disabled={!selectedEquipmentId || !date}
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Maintenance Preview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-[#333333] flex items-center justify-between">
                  <span className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Upcoming Maintenance
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="border-[#E02020] text-[#E02020]"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showFilters && (
                  <div className="mb-4 p-4 border rounded-lg bg-gray-50 space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Select value={filters.status || ''} onValueChange={(value) => applyFilters({...filters, status: value || undefined})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filters.priority || ''} onValueChange={(value) => applyFilters({...filters, priority: value || undefined})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filters.maintenance_type || ''} onValueChange={(value) => applyFilters({...filters, maintenance_type: value || undefined})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="preventive">Preventive</SelectItem>
                          <SelectItem value="corrective">Corrective</SelectItem>
                          <SelectItem value="calibration">Calibration</SelectItem>
                          <SelectItem value="inspection">Inspection</SelectItem>
                          <SelectItem value="repair">Repair</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="outline" onClick={resetFilters} className="w-full">
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredMaintenance.slice(0, 10).map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getMaintenanceTypeIcon(item.maintenance_type)}
                            <h4 className="font-medium">{item.equipment?.name}</h4>
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                            {item.is_overdue && (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {format(parseISO(item.scheduled_date), 'PPp')} - 
                            {formatDistanceToNow(parseISO(item.scheduled_date), { addSuffix: true })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.equipment?.location} • {item.estimated_duration}h estimated
                          </p>
                          {item.description && (
                            <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                          )}
                          {item.technician_name && (
                            <p className="text-sm text-blue-600 mt-1">
                              Assigned to: {item.technician_name}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {item.status === 'scheduled' && (
                            <Button
                              size="sm"
                              onClick={() => updateMaintenance(item.id, { status: 'in_progress' })}
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                              Start
                            </Button>
                          )}
                          {item.status === 'in_progress' && (
                            <Button
                              size="sm"
                              onClick={() => handleCompleteMaintenanceClick(item)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                          )}
                          {(item.status === 'scheduled' || item.status === 'in_progress') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateMaintenance(item.id, { status: 'cancelled' })}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredMaintenance.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No maintenance records found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#333333] flex items-center justify-between">
                <span className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  All Maintenance Records
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-[#E02020] text-[#E02020]"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showFilters && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                    <Select value={filters.equipment || ''} onValueChange={(value) => applyFilters({...filters, equipment: value || undefined})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipment.map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filters.status || ''} onValueChange={(value) => applyFilters({...filters, status: value || undefined})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filters.priority || ''} onValueChange={(value) => applyFilters({...filters, priority: value || undefined})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filters.maintenance_type || ''} onValueChange={(value) => applyFilters({...filters, maintenance_type: value || undefined})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preventive">Preventive</SelectItem>
                        <SelectItem value="corrective">Corrective</SelectItem>
                        <SelectItem value="calibration">Calibration</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={resetFilters} className="w-full">
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="overdue-filter"
                      checked={filters.is_overdue === true}
                      onChange={(e) => applyFilters({...filters, is_overdue: e.target.checked ? true : undefined})}
                      className="rounded"
                    />
                    <Label htmlFor="overdue-filter" className="text-sm">
                      Show only overdue maintenance
                    </Label>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading maintenance records...
                      </TableCell>
                    </TableRow>
                  ) : filteredMaintenance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No maintenance records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMaintenance.map((item) => (
                      <TableRow key={item.id} className={item.is_overdue ? 'bg-red-50' : ''}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getMaintenanceTypeIcon(item.maintenance_type)}
                            <div>
                              <p className="font-medium">{item.equipment?.name}</p>
                              <p className="text-sm text-gray-500">{item.equipment?.location}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.maintenance_type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-3 w-3 text-gray-500" />
                            <div>
                              <p className="text-sm">{format(parseISO(item.scheduled_date), 'MMM dd, yyyy')}</p>
                              <p className="text-xs text-gray-500">
                                {format(parseISO(item.scheduled_date), 'h:mm a')}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                            {item.is_overdue && (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {item.technician_name || 'Unassigned'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {item.status === 'scheduled' && (
                              <Button
                                size="sm"
                                onClick={() => updateMaintenance(item.id, { status: 'in_progress' })}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                              >
                                Start
                              </Button>
                            )}
                            {item.status === 'in_progress' && (
                              <Button
                                size="sm"
                                onClick={() => handleCompleteMaintenanceClick(item)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Complete
                              </Button>
                            )}
                            {(item.status === 'scheduled' || item.status === 'in_progress') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateMaintenance(item.id, { status: 'cancelled' })}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#333333] flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Maintenance Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Completion Rate</span>
                    <span className="font-semibold">
                      {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Duration</span>
                    <span className="font-semibold">
                      {maintenance.filter(m => m.actual_duration).length > 0 
                        ? Math.round(
                            maintenance
                              .filter(m => m.actual_duration)
                              .reduce((acc, m) => acc + (m.actual_duration || 0), 0) /
                            maintenance.filter(m => m.actual_duration).length
                          ) + 'h'
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>On-Time Completion</span>
                    <span className="font-semibold">
                      {maintenance.filter(m => m.status === 'completed' && !m.is_overdue).length} / {stats.completed}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#333333] flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Attention Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.overdue > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 font-medium">
                        {stats.overdue} overdue maintenance task{stats.overdue > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                  {stats.critical > 0 && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-purple-800 font-medium">
                        {stats.critical} critical priority task{stats.critical > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                  {stats.overdue === 0 && stats.critical === 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">
                        All maintenance tasks are on track!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <MaintenanceCompletionModal
        maintenance={selectedMaintenance}
        open={completionModalOpen}
        onOpenChange={setCompletionModalOpen}
        onComplete={handleCompleteMaintenance}
      />
    </div>
  );
};

export default EnhancedMaintenanceScheduler;