
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, FileText, AlertTriangle, Activity } from "lucide-react";

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

interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  date: Date;
  type: string;
  technician: string;
  notes: string;
  parts?: string[];
  nextScheduledDate?: Date;
}

interface EquipmentHistoryProps {
  equipmentId: string;
  equipmentName: string;
  events: HistoryEvent[];
  maintenanceRecords: MaintenanceRecord[];
}

const EquipmentHistory: React.FC<EquipmentHistoryProps> = ({
  equipmentId,
  equipmentName,
  events,
  maintenanceRecords
}) => {
  const sortedEvents = [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const sortedMaintenance = [...maintenanceRecords].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'usage': return <Activity className="h-4 w-4 text-green-500" />;
      case 'calibration': return <Clock className="h-4 w-4 text-purple-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'transfer': return <FileText className="h-4 w-4 text-amber-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'usage': return 'bg-green-100 text-green-800 border-green-300';
      case 'calibration': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'error': return 'bg-red-100 text-red-800 border-red-300';
      case 'transfer': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="w-full border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600">Equipment History</CardTitle>
        <CardDescription>
          Historical data and maintenance records for {equipmentName} (ID: {equipmentId})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="timeline">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance Records</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-4">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-4">
                {sortedEvents.length > 0 ? (
                  sortedEvents.map((event, index) => (
                    <div key={event.id} className="ml-10 relative pl-6 pb-4">
                      {/* Timeline dot */}
                      <div className="absolute -left-6 mt-1.5 w-3 h-3 rounded-full border-2 border-white bg-red-600"></div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            {getEventIcon(event.type)}
                            <h4 className="text-md font-medium ml-2">{event.description}</h4>
                          </div>
                          
                          <div className="text-sm text-gray-500 mt-1">
                            {event.details && <p>{event.details}</p>}
                            
                            {event.user && (
                              <p className="mt-1">
                                By: {event.user}
                                {event.location && ` at ${event.location}`}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500">
                            {event.timestamp.toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {event.timestamp.toLocaleTimeString()}
                          </span>
                          
                          <Badge className={`mt-1 ${getEventBadgeColor(event.type)}`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No history events found for this equipment
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="maintenance" className="mt-4">
            <div className="divide-y">
              {sortedMaintenance.length > 0 ? (
                sortedMaintenance.map((record) => (
                  <div key={record.id} className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                          <h4 className="font-medium">{record.type} Maintenance</h4>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Technician: {record.technician}
                        </p>
                        <p className="text-sm mt-2">{record.notes}</p>
                        
                        {record.parts && record.parts.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Parts Replaced:</p>
                            <ul className="list-disc list-inside text-sm ml-2">
                              {record.parts.map((part, idx) => (
                                <li key={idx}>{part}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium">
                          {record.date.toLocaleDateString()}
                        </span>
                        
                        {record.nextScheduledDate && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Next: {record.nextScheduledDate.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No maintenance records found for this equipment
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EquipmentHistory;
