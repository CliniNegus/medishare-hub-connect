
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCodeScanner from '@/components/equipment/QRCodeScanner';
import MaintenanceScheduler from '@/components/equipment/MaintenanceScheduler';
import EquipmentHistory from '@/components/equipment/EquipmentHistory';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LoadingState from '@/components/ui/loading-state';
import InteractiveTooltip from '@/components/ui/interactive-tooltip';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { IoTUsageTracker } from '@/components/tracking/IoTUsageTracker';
import { QrCode, Calendar, Clock, AlertTriangle, Database, FileText } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  status: string;
  location: string;
}

interface MaintenanceTask {
  id: string;
  equipmentId: string;
  equipmentName: string;
  date: Date;
  type: 'preventive' | 'corrective' | 'calibration';
  notes: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  completed: boolean;
  createdAt: Date;
}

interface HistoryEvent {
  id: string;
  equipmentId: string;
  timestamp: Date;
  type: 'maintenance' | 'usage' | 'calibration' | 'error' | 'transfer';
  description: string;
  details?: string;
  user?: string;
  location?: string;
}

const EquipmentManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  
  const [isScanning, setIsScanning] = useState(false);
  const [schedulingMaintenance, setSchedulingMaintenance] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [viewingHistory, setViewingHistory] = useState(false);
  
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([]);
  
  useEffect(() => {
    fetchEquipment();
    fetchMaintenanceTasks();
  }, []);
  
  const fetchEquipment = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from the database
      // For demo purposes, we'll create mock data
      
      const mockEquipment = [
        { id: 'EQ-001', name: 'MRI Scanner X9000', manufacturer: 'MedTech', status: 'Active', location: 'Room 101' },
        { id: 'EQ-002', name: 'CT Scanner Ultra', manufacturer: 'ImagingCorp', status: 'Maintenance', location: 'Room 102' },
        { id: 'EQ-003', name: 'Ultrasound System', manufacturer: 'SonoSys', status: 'Active', location: 'Room 103' },
        { id: 'EQ-004', name: 'X-Ray Machine', manufacturer: 'RayTech', status: 'Inactive', location: 'Storage' },
        { id: 'EQ-005', name: 'Patient Monitor X3', manufacturer: 'VitalCorp', status: 'Active', location: 'ICU' },
      ];
      
      setEquipment(mockEquipment);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast({
        title: "Failed to load equipment",
        description: "Could not retrieve equipment data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMaintenanceTasks = async () => {
    try {
      // In a real app, this would fetch from the database
      // For demo purposes, we'll create mock data
      
      const mockTasks: MaintenanceTask[] = [
        {
          id: 'task-001',
          equipmentId: 'EQ-001',
          equipmentName: 'MRI Scanner X9000',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          type: 'preventive',
          notes: 'Regular maintenance check and calibration',
          priority: 'medium',
          assignee: 'John Smith',
          completed: false,
          createdAt: new Date()
        },
        {
          id: 'task-002',
          equipmentId: 'EQ-002',
          equipmentName: 'CT Scanner Ultra',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          type: 'corrective',
          notes: 'Fix power supply issue',
          priority: 'high',
          assignee: 'Jane Doe',
          completed: false,
          createdAt: new Date()
        }
      ];
      
      setMaintenanceTasks(mockTasks);
      
      // Generate mock history events
      const mockHistoryEvents: HistoryEvent[] = [
        {
          id: 'hist-001',
          equipmentId: 'EQ-001',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
          type: 'maintenance',
          description: 'Preventive Maintenance',
          details: 'Regular scheduled maintenance performed',
          user: 'John Smith',
          location: 'Room 101'
        },
        {
          id: 'hist-002',
          equipmentId: 'EQ-001',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          type: 'calibration',
          description: 'System Calibration',
          details: 'Full system calibration performed',
          user: 'Jane Doe',
          location: 'Room 101'
        },
        {
          id: 'hist-003',
          equipmentId: 'EQ-001',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          type: 'error',
          description: 'System Error',
          details: 'Error code E-203: Power fluctuation detected',
          location: 'Room 101'
        },
        {
          id: 'hist-004',
          equipmentId: 'EQ-001',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          type: 'usage',
          description: 'System Used',
          details: '3 patient scans performed',
          user: 'Dr. Smith',
          location: 'Room 101'
        }
      ];
      
      setHistoryEvents(mockHistoryEvents);
      
    } catch (error) {
      console.error('Error fetching maintenance tasks:', error);
    }
  };
  
  const handleQRScan = (data: string) => {
    // Find the equipment by ID
    const scannedEquipment = equipment.find(eq => eq.id === data);
    
    if (scannedEquipment) {
      setSelectedEquipment(scannedEquipment);
      setViewingHistory(true);
    } else {
      toast({
        title: "Equipment Not Found",
        description: `No equipment matching ID: ${data}`,
        variant: "destructive",
      });
    }
  };
  
  const handleScheduleMaintenance = (task: MaintenanceTask) => {
    setMaintenanceTasks(prev => [...prev, task]);
    
    // Also add to history
    const newHistoryEvent: HistoryEvent = {
      id: `hist-${Date.now()}`,
      equipmentId: task.equipmentId,
      timestamp: new Date(),
      type: 'maintenance',
      description: `${task.type.charAt(0).toUpperCase() + task.type.slice(1)} Maintenance Scheduled`,
      details: task.notes,
      user: user?.email || 'Admin',
      location: selectedEquipment?.location
    };
    
    setHistoryEvents(prev => [...prev, newHistoryEvent]);
    
    toast({
      title: "Maintenance Scheduled",
      description: `Maintenance scheduled for ${selectedEquipment?.name}`,
    });
    
    setSchedulingMaintenance(false);
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'maintenance': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const maintenanceHistory = historyEvents.filter(
    event => event.equipmentId === selectedEquipment?.id && 
    (event.type === 'maintenance' || event.type === 'calibration')
  );

  return (
    <ResponsiveContainer maxWidth="1280px" className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-500">
          Equipment Management
        </h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="border-red-600 text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-950"
          >
            Back
          </Button>
          
          <InteractiveTooltip
            content={
              <div className="p-2">
                <h3 className="font-medium">QR Code Scanning</h3>
                <p className="text-sm mt-1">Scan equipment QR codes to quickly access maintenance history and details.</p>
              </div>
            }
          >
            <Button 
              onClick={() => setIsScanning(true)}
              className="flex items-center"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Scan QR Code
            </Button>
          </InteractiveTooltip>
        </div>
      </div>
      
      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="list">Equipment List</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Schedule</TabsTrigger>
          <TabsTrigger value="iot">IoT Monitoring</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {loading ? (
            <LoadingState 
              type="skeleton" 
              active={true} 
              text="Loading equipment data..." 
              className="w-full h-64" 
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Equipment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Manufacturer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {equipment.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.manufacturer}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedEquipment(item);
                                setSchedulingMaintenance(true);
                              }}
                              className="flex items-center"
                            >
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              Maintenance
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedEquipment(item);
                                setViewingHistory(true);
                              }}
                              className="flex items-center"
                            >
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              History
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="maintenance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center text-red-600 dark:text-red-500">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Maintenance
              </h2>
              
              {maintenanceTasks.length > 0 ? (
                <div className="space-y-4">
                  {maintenanceTasks
                    .filter(task => !task.completed && new Date(task.date) > new Date())
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map(task => (
                      <div 
                        key={task.id} 
                        className={`p-4 rounded-md border ${
                          task.priority === 'high' 
                            ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30' 
                            : task.priority === 'medium'
                              ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/30'
                              : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{task.equipmentName}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{task.type.charAt(0).toUpperCase() + task.type.slice(1)} Maintenance</p>
                            <p className="text-sm mt-1">{task.notes}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{new Date(task.date).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Assigned: {task.assignee}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                  No upcoming maintenance tasks scheduled
                </div>
              )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center text-red-600 dark:text-red-500">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Maintenance Alerts
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">MRI Scanner X9000 (EQ-001)</h3>
                      <p className="text-sm text-red-800 dark:text-red-300">Calibration Overdue by 7 days</p>
                      <p className="text-sm mt-1">Annual calibration was due on {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/30">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">CT Scanner Ultra (EQ-002)</h3>
                      <p className="text-sm text-amber-800 dark:text-amber-300">Maintenance Due in 2 days</p>
                      <p className="text-sm mt-1">Scheduled maintenance on {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/30">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">X-Ray Machine (EQ-004)</h3>
                      <p className="text-sm text-amber-800 dark:text-amber-300">Low Usage Warning</p>
                      <p className="text-sm mt-1">Equipment has been inactive for 30+ days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="iot">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center text-red-600 dark:text-red-500">
                <Database className="h-5 w-5 mr-2" />
                Connected IoT Devices
              </h2>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {equipment.slice(0, 3).map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedEquipment(item);
                          setActiveTab('iot_details');
                        }}
                      >
                        View Data
                      </Button>
                    </div>
                    <div className="mt-1 grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div>ID: {item.id}</div>
                      <div>Signal: {Math.floor(Math.random() * 30) + 70}%</div>
                      <div>Battery: {Math.floor(Math.random() * 20) + 80}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center text-red-600 dark:text-red-500">
                <FileText className="h-5 w-5 mr-2" />
                Device Usage Summary
              </h2>
              
              <div className="space-y-4">
                {equipment.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last active: {new Date(Date.now() - Math.floor(Math.random() * 48) * 3600000).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{Math.floor(Math.random() * 8) + 2} hours today</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.floor(Math.random() * 200) + 800} hours total
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                  <Button variant="outline" className="w-full">View Full Usage Reports</Button>
                </div>
              </div>
            </div>
            
            {/* IoT Device Detail View */}
            {selectedEquipment && (
              <div className="md:col-span-2">
                <IoTUsageTracker 
                  equipmentId={selectedEquipment.id} 
                  pricePerUse={25} 
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* QR Scanner Dialog */}
      <Dialog open={isScanning} onOpenChange={setIsScanning}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Scan Equipment QR Code</DialogTitle>
          <QRCodeScanner 
            onScan={handleQRScan}
            onClose={() => setIsScanning(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Maintenance Scheduler Dialog */}
      <Dialog open={schedulingMaintenance} onOpenChange={setSchedulingMaintenance}>
        <DialogContent className="sm:max-w-4xl">
          <DialogTitle>Schedule Maintenance</DialogTitle>
          {selectedEquipment && (
            <MaintenanceScheduler 
              equipmentId={selectedEquipment.id}
              equipmentName={selectedEquipment.name}
              onSchedule={handleScheduleMaintenance}
              onClose={() => setSchedulingMaintenance(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Equipment History Dialog */}
      <Dialog open={viewingHistory} onOpenChange={setViewingHistory}>
        <DialogContent className="sm:max-w-4xl">
          <DialogTitle>Equipment History</DialogTitle>
          {selectedEquipment && (
            <EquipmentHistory 
              equipmentId={selectedEquipment.id}
              equipmentName={selectedEquipment.name}
              events={historyEvents.filter(event => event.equipmentId === selectedEquipment.id)}
              maintenanceRecords={[
                {
                  id: 'maint-001',
                  equipmentId: selectedEquipment.id,
                  date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  type: 'Preventive',
                  technician: 'John Smith',
                  notes: 'Regular maintenance check performed. All systems functioning properly.',
                  parts: ['Filter Replacement', 'Software Update v2.3.4'],
                  nextScheduledDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                },
                {
                  id: 'maint-002',
                  equipmentId: selectedEquipment.id,
                  date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                  type: 'Calibration',
                  technician: 'Jane Doe',
                  notes: 'Full system calibration performed. Accuracy within acceptable parameters.',
                  nextScheduledDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
              ]}
            />
          )}
        </DialogContent>
      </Dialog>
    </ResponsiveContainer>
  );
};

export default EquipmentManagement;
