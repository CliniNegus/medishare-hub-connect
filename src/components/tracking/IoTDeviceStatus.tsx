
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Battery, Activity, Signal, MapPin } from "lucide-react";

interface IoTDeviceStatusProps {
  deviceId: string;
  equipmentName: string;
  status: 'online' | 'offline' | 'standby';
  lastActive: string;
  batteryLevel: number;
  signalStrength: number;
  location?: string;
  usageData?: {
    hoursToday: number;
    totalHours: number;
    powerCycles: number;
  };
}

const IoTDeviceStatus: React.FC<IoTDeviceStatusProps> = ({
  deviceId,
  equipmentName,
  status,
  lastActive,
  batteryLevel,
  signalStrength,
  location,
  usageData
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'standby':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBatteryIcon = (level: number) => {
    if (level > 75) return <Battery className="w-4 h-4 text-green-500" />;
    if (level > 25) return <Battery className="w-4 h-4 text-yellow-500" />;
    return <Battery className="w-4 h-4 text-red-500" />;
  };

  const getSignalIcon = (strength: number) => {
    if (strength > 75) return <Signal className="w-4 h-4 text-green-500" />;
    if (strength > 25) return <Signal className="w-4 h-4 text-yellow-500" />;
    return <Signal className="w-4 h-4 text-red-500" />;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{equipmentName}</CardTitle>
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">Device ID: {deviceId}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Last active: {lastActive}</span>
            </div>
            <div className="flex items-center space-x-2">
              {getBatteryIcon(batteryLevel)}
              <span className="text-sm">Battery: {batteryLevel}%</span>
            </div>
            <div className="flex items-center space-x-2">
              {getSignalIcon(signalStrength)}
              <span className="text-sm">Signal: {signalStrength}%</span>
            </div>
            {location && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{location}</span>
              </div>
            )}
          </div>
          
          {usageData && (
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-2">Usage Statistics</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 bg-gray-50 rounded-md text-center">
                  <p className="text-xs text-gray-500">Today</p>
                  <p className="text-sm font-medium">{usageData.hoursToday}h</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-md text-center">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-sm font-medium">{usageData.totalHours}h</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-md text-center">
                  <p className="text-xs text-gray-500">Cycles</p>
                  <p className="text-sm font-medium">{usageData.powerCycles}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IoTDeviceStatus;
