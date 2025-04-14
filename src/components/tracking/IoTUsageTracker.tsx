
import React, { useState, useEffect } from 'react';
import { useIoTData } from '@/hooks/useIoTData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Battery, Wifi, Activity, Clock, DollarSign } from "lucide-react";
import UsageChart from './UsageChart';

interface IoTUsageTrackerProps {
  equipmentId: string;
  pricePerUse: number;
}

const IoTUsageTracker: React.FC<IoTUsageTrackerProps> = ({ equipmentId, pricePerUse }) => {
  const { device, usageData, loading, error } = useIoTData(equipmentId);
  const [totalCost, setTotalCost] = useState(0);
  const [usageCount, setUsageCount] = useState(0);
  
  useEffect(() => {
    if (device && device.usageData) {
      // Simulate usage count from power cycles
      const count = device.usageData.powerCycles;
      setUsageCount(count);
      setTotalCost(count * pricePerUse);
    }
  }, [device, pricePerUse]);
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loading Device Data...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <Progress value={40} className="w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="w-full border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Device</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (!device) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Device Data</CardTitle>
          <CardDescription>Device may be offline or not registered</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'standby': return 'bg-amber-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{device.equipmentName}</CardTitle>
            <CardDescription className="mt-1">ID: {device.deviceId}</CardDescription>
          </div>
          <Badge className={`${getStatusColor(device.status)} text-white`}>
            {device.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Device Status */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1 flex items-center">
                <Battery className="h-3 w-3 mr-1" /> Battery
              </div>
              <Progress value={device.batteryLevel} className="w-full h-2 mb-1" />
              <span className="text-sm font-medium">{device.batteryLevel}%</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1 flex items-center">
                <Wifi className="h-3 w-3 mr-1" /> Signal
              </div>
              <Progress value={device.signalStrength} className="w-full h-2 mb-1" />
              <span className="text-sm font-medium">{device.signalStrength}%</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1 flex items-center">
                <Activity className="h-3 w-3 mr-1" /> Usage
              </div>
              <div className="text-sm font-medium">
                {device.usageData.hoursToday.toFixed(1)} hrs today
              </div>
              <div className="text-xs text-gray-500">
                {device.usageData.totalHours} hrs total
              </div>
            </div>
          </div>
          
          {/* Usage Chart */}
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <BarChart className="h-4 w-4 mr-1" /> Usage Data
            </h4>
            <div className="h-36">
              {usageData.length > 0 && <UsageChart data={usageData} title="Device Usage" />}
            </div>
          </div>
          
          {/* Pay-Per-Use Billing Information */}
          <div className="mt-4 bg-gray-50 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-green-600" /> Pay-Per-Use Billing
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Total Uses</span>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-red-600" />
                  <span className="text-sm font-medium">{usageCount} times</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Cost Per Use</span>
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-sm font-medium">${pricePerUse.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Cost</span>
                <span className="text-sm font-bold text-red-600">${totalCost.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Last billed: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IoTUsageTracker;
