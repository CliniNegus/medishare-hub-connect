import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Battery, Thermometer, Zap } from "lucide-react";

interface EquipmentIoTTabProps {
  equipmentId: string;
}

const EquipmentIoTTab: React.FC<EquipmentIoTTabProps> = ({ equipmentId }) => {
  // Mock IoT data - in real app, this would come from your IoT data source
  const iotData = {
    connectionStatus: 'Connected',
    signalStrength: 87,
    batteryLevel: 94,
    temperature: 22.5,
    powerUsage: 1.2,
    lastSync: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  {iotData.connectionStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Signal Strength</span>
                <span className="font-medium">{iotData.signalStrength}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Sync</span>
                <span className="font-medium">
                  {new Date(iotData.lastSync).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensor Readings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Battery Level</p>
                <p className="text-2xl font-bold text-foreground">{iotData.batteryLevel}%</p>
              </div>
              <Battery className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-2xl font-bold text-foreground">{iotData.temperature}°C</p>
              </div>
              <Thermometer className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Power Usage</p>
                <p className="text-2xl font-bold text-foreground">{iotData.powerUsage}kW</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Information */}
      <Card>
        <CardHeader>
          <CardTitle>Device Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Hardware Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device ID:</span>
                  <span className="font-medium">{equipmentId.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Firmware Version:</span>
                  <span className="font-medium">v2.1.3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protocol:</span>
                  <span className="font-medium">MQTT over TLS</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Network Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IP Address:</span>
                  <span className="font-medium">192.168.1.45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MAC Address:</span>
                  <span className="font-medium">00:1B:44:11:3A:B7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Usage (24h):</span>
                  <span className="font-medium">2.3 MB</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentIoTTab;