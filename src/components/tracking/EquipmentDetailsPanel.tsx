import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Zap, BarChart3, Wifi, AlertTriangle, Settings2 } from "lucide-react";
import EquipmentMetricsTab from "./tabs/EquipmentMetricsTab";
import EquipmentIoTTab from "./tabs/EquipmentIoTTab";
import EquipmentAlertsTab from "./tabs/EquipmentAlertsTab";
import EquipmentSettingsTab from "./tabs/EquipmentSettingsTab";

interface TrackingEquipment {
  id: string;
  name: string;
  category: string;
  status: string;
  location: string;
  image_url?: string;
  usage_hours: number;
  downtime_hours: number;
  remote_control_enabled: boolean;
  updated_at: string;
}

interface EquipmentAnalytics {
  id: string;
  equipment_id: string;
  usage_hours: number;
  downtime_hours: number;
  revenue_generated: number;
  date_recorded: string;
  last_location: string;
}

interface EquipmentDetailsPanelProps {
  selectedEquipment?: TrackingEquipment;
  analytics: EquipmentAnalytics[];
}

const EquipmentDetailsPanel: React.FC<EquipmentDetailsPanelProps> = ({
  selectedEquipment,
  analytics,
}) => {
  if (!selectedEquipment) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center space-y-3">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">No Device Selected</h3>
            <p className="text-muted-foreground">
              Select a device from the sidebar to view its details
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
      case 'online':
        return 'bg-green-500';
      case 'in use':
      case 'busy':
        return 'bg-yellow-500';
      case 'maintenance':
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isOnline = selectedEquipment.status.toLowerCase() === 'available' || selectedEquipment.status.toLowerCase() === 'online';

  return (
    <div className="space-y-6">
      {/* Device Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                {selectedEquipment.name}
                {isOnline && (
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(selectedEquipment.status)} animate-pulse`} />
                    <span className="text-sm font-medium text-green-600">Live</span>
                  </div>
                )}
              </CardTitle>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedEquipment.location}
                </span>
                <Badge variant="outline">{selectedEquipment.category}</Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge 
                variant={isOnline ? "default" : "secondary"}
                className={isOnline ? "bg-green-100 text-green-800 border-green-200" : ""}
              >
                {selectedEquipment.status}
              </Badge>
              {selectedEquipment.remote_control_enabled && (
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Zap className="h-4 w-4 mr-2" />
                  Remote Control
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabbed Interface */}
      <Card>
        <Tabs defaultValue="metrics" className="w-full">
          <CardHeader className="pb-3">
            <TabsList className="grid w-full grid-cols-4 sticky top-0 z-10">
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Real-time Metrics</span>
                <span className="sm:hidden">Metrics</span>
              </TabsTrigger>
              <TabsTrigger value="iot" className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                <span className="hidden sm:inline">IoT Data</span>
                <span className="sm:hidden">IoT</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Alerts</span>
                <span className="sm:hidden">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Settings</span>
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <CardContent>
            <TabsContent value="metrics" className="mt-0">
              <EquipmentMetricsTab 
                analytics={analytics} 
                equipmentName={selectedEquipment.name}
                equipment={selectedEquipment}
              />
            </TabsContent>
            
            <TabsContent value="iot" className="mt-0">
              <EquipmentIoTTab equipmentId={selectedEquipment.id} />
            </TabsContent>
            
            <TabsContent value="alerts" className="mt-0">
              <EquipmentAlertsTab equipmentId={selectedEquipment.id} />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <EquipmentSettingsTab equipment={selectedEquipment} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default EquipmentDetailsPanel;