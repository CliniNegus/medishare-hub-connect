
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  FileText, 
  Clock, 
  Settings, 
  User, 
  CheckCircle, 
  AlertCircle,
  FileBarChart
} from "lucide-react";
import { EquipmentProps } from '../EquipmentCard';
import { format, subDays, subMonths } from 'date-fns';

interface EquipmentHistoryProps {
  equipmentData: EquipmentProps[];
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string) => void;
}

interface MaintenanceLog {
  id: string;
  equipmentId: string;
  type: 'preventive' | 'corrective' | 'calibration' | 'inspection';
  status: 'completed' | 'scheduled' | 'in-progress' | 'canceled';
  date: Date;
  technician: string;
  notes: string;
  duration: number; // in hours
}

interface UsageLog {
  id: string;
  equipmentId: string;
  date: Date;
  user: string;
  duration: number; // in hours
  patient: string;
  procedure: string;
}

interface AlertLog {
  id: string;
  equipmentId: string;
  date: Date;
  type: 'error' | 'warning' | 'info';
  message: string;
  resolved: boolean;
  resolvedDate?: Date;
  resolvedBy?: string;
}

const EquipmentHistory: React.FC<EquipmentHistoryProps> = ({
  equipmentData,
  selectedEquipmentId,
  onSelectEquipment
}) => {
  const [historyType, setHistoryType] = useState("maintenance");
  const [timeFilter, setTimeFilter] = useState("all");
  
  const selectedEquipment = selectedEquipmentId 
    ? equipmentData.find(eq => eq.id === selectedEquipmentId) 
    : null;
  
  // Mock data - in a real app this would come from an API
  const maintenanceLogs: MaintenanceLog[] = [
    {
      id: "ml-001",
      equipmentId: "eq-001",
      type: 'preventive',
      status: 'completed',
      date: subDays(new Date(), 30),
      technician: "John Smith",
      notes: "Regular 6-month maintenance completed. Replaced worn parts.",
      duration: 3
    },
    {
      id: "ml-002",
      equipmentId: "eq-001",
      type: 'calibration',
      status: 'completed',
      date: subDays(new Date(), 60),
      technician: "Alice Johnson",
      notes: "Calibrated according to manufacturer specifications.",
      duration: 2
    },
    {
      id: "ml-003",
      equipmentId: "eq-002",
      type: 'corrective',
      status: 'completed',
      date: subDays(new Date(), 15),
      technician: "Bob Miller",
      notes: "Fixed issue with power supply. Replaced faulty component.",
      duration: 4
    }
  ];
  
  const usageLogs: UsageLog[] = [
    {
      id: "ul-001",
      equipmentId: "eq-001",
      date: subDays(new Date(), 2),
      user: "Dr. Emily Carter",
      duration: 1.5,
      patient: "Patient #12345",
      procedure: "MRI Scan - Brain"
    },
    {
      id: "ul-002",
      equipmentId: "eq-001",
      date: subDays(new Date(), 3),
      user: "Dr. Michael Johnson",
      duration: 1,
      patient: "Patient #67890",
      procedure: "MRI Scan - Spine"
    },
    {
      id: "ul-003",
      equipmentId: "eq-002",
      date: subDays(new Date(), 1),
      user: "Dr. Sarah Lee",
      duration: 0.75,
      patient: "Patient #54321",
      procedure: "CT Scan - Chest"
    }
  ];
  
  const alertLogs: AlertLog[] = [
    {
      id: "al-001",
      equipmentId: "eq-001",
      date: subDays(new Date(), 45),
      type: 'error',
      message: "System overheated during procedure. Emergency shutdown activated.",
      resolved: true,
      resolvedDate: subDays(new Date(), 44),
      resolvedBy: "Tech Support Team"
    },
    {
      id: "al-002",
      equipmentId: "eq-002",
      date: subDays(new Date(), 10),
      type: 'warning',
      message: "Calibration due in 5 days. Schedule maintenance soon.",
      resolved: true,
      resolvedDate: subDays(new Date(), 8),
      resolvedBy: "Alice Johnson"
    },
    {
      id: "al-003",
      equipmentId: "eq-001",
      date: subDays(new Date(), 5),
      type: 'info',
      message: "Software update available. Install during next maintenance.",
      resolved: false
    }
  ];
  
  // Filter logs based on selected equipment and time filter
  const filterByTime = (date: Date) => {
    const now = new Date();
    switch (timeFilter) {
      case "week":
        return date >= subDays(now, 7);
      case "month":
        return date >= subDays(now, 30);
      case "quarter":
        return date >= subDays(now, 90);
      case "year":
        return date >= subMonths(now, 12);
      default:
        return true; // "all"
    }
  };
  
  const filteredMaintenanceLogs = maintenanceLogs
    .filter(log => !selectedEquipmentId || log.equipmentId === selectedEquipmentId)
    .filter(log => filterByTime(log.date))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
    
  const filteredUsageLogs = usageLogs
    .filter(log => !selectedEquipmentId || log.equipmentId === selectedEquipmentId)
    .filter(log => filterByTime(log.date))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
    
  const filteredAlertLogs = alertLogs
    .filter(log => !selectedEquipmentId || log.equipmentId === selectedEquipmentId)
    .filter(log => filterByTime(log.date))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Helper functions for styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <Select value={selectedEquipmentId || ""} onValueChange={onSelectEquipment}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Equipment</SelectItem>
              {equipmentData.map(equipment => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-4">
          <Select value={historyType} onValueChange={setHistoryType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Log type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maintenance">Maintenance Logs</SelectItem>
              <SelectItem value="usage">Usage Logs</SelectItem>
              <SelectItem value="alerts">Alert Logs</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {selectedEquipment && (
        <Card className="mb-6 border-red-200">
          <CardHeader className="bg-red-50 py-3 px-6 border-b border-red-200">
            <CardTitle className="text-lg text-red-800">{selectedEquipment.name} - History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-gray-600 mb-1">Maintenance Count</p>
                <p className="text-2xl font-bold text-red-600">
                  {maintenanceLogs.filter(log => log.equipmentId === selectedEquipment.id).length}
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-gray-600 mb-1">Usage Hours</p>
                <p className="text-2xl font-bold text-red-600">
                  {usageLogs
                    .filter(log => log.equipmentId === selectedEquipment.id)
                    .reduce((sum, log) => sum + log.duration, 0)
                  }
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-gray-600 mb-1">Alert Count</p>
                <p className="text-2xl font-bold text-red-600">
                  {alertLogs.filter(log => log.equipmentId === selectedEquipment.id).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {historyType === "maintenance" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaintenanceLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No maintenance logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredMaintenanceLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {equipmentData.find(eq => eq.id === log.equipmentId)?.name || log.equipmentId}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {format(log.date, 'PPP')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      {log.technician}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      {log.duration} hours
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-600 hover:bg-red-50">
                      <FileText className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
      
      {historyType === "usage" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Procedure</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsageLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No usage logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsageLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {equipmentData.find(eq => eq.id === log.equipmentId)?.name || log.equipmentId}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {format(log.date, 'PPP')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      {log.user}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      {log.duration} hours
                    </div>
                  </TableCell>
                  <TableCell>{log.procedure}</TableCell>
                  <TableCell>{log.patient}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-600 hover:bg-red-50">
                      <FileBarChart className="h-3 w-3 mr-1" />
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
      
      {historyType === "alerts" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Resolved By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlertLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No alert logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredAlertLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {equipmentData.find(eq => eq.id === log.equipmentId)?.name || log.equipmentId}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {format(log.date, 'PPP')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getAlertTypeColor(log.type)}`}>
                      {log.type}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{log.message}</TableCell>
                  <TableCell>
                    {log.resolved ? (
                      <Badge className="bg-green-100 text-green-800 border-0">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolved
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800 border-0">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Open
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {log.resolvedBy ? (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        {log.resolvedBy}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-600 hover:bg-red-50">
                      <FileText className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
      
      <div className="flex justify-end mt-6">
        <Button 
          variant="outline" 
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          <FileBarChart className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
};

export default EquipmentHistory;
