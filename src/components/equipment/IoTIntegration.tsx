
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Database, 
  Wifi, 
  Battery, 
  RefreshCw, 
  Link,
  Settings,
  BarChart2,
  Clock
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EquipmentProps } from '../EquipmentCard';
import { useToast } from "@/components/ui/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface IoTIntegrationProps {
  equipmentData: EquipmentProps[];
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string) => void;
}

interface IoTDevice {
  id: string;
  equipmentId: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  batteryLevel: number;
  signalStrength: number;
  lastSyncTime: Date;
  firmware: string;
  sensors: {
    name: string;
    value: number;
    unit: string;
  }[];
  telemetryInterval: number; // in seconds
}

// Mock time-series data for charts
const generateTimeSeriesData = (points = 24, baseValue = 70, variance = 10) => {
  return Array.from({ length: points }).map((_, index) => {
    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() - (points - index));
    
    return {
      time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: Math.round((baseValue + Math.random() * variance) * 10) / 10,
      vibration: Math.round((baseValue / 2 + Math.random() * (variance / 2)) * 10) / 10,
      humidity: Math.round((40 + Math.random() * 20) * 10) / 10,
      powerUsage: Math.round((200 + Math.random() * 50) * 10) / 10
    };
  });
};

const IoTIntegration: React.FC<IoTIntegrationProps> = ({
  equipmentData,
  selectedEquipmentId,
  onSelectEquipment
}) => {
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [telemetryData, setTelemetryData] = useState(generateTimeSeriesData());
  const [activeChart, setActiveChart] = useState("temperature");
  
  // Mock IoT devices data
  const iotDevices: IoTDevice[] = [
    {
      id: "iot-001",
      equipmentId: "eq-001",
      name: "MRI Scanner IoT Monitor",
      status: 'online',
      batteryLevel: 82,
      signalStrength: 95,
      lastSyncTime: new Date(),
      firmware: "v2.3.4",
      sensors: [
        { name: "Temperature", value: 72.5, unit: "°F" },
        { name: "Humidity", value: 45, unit: "%" },
        { name: "Vibration", value: 2.3, unit: "Hz" },
        { name: "Power", value: 230, unit: "W" }
      ],
      telemetryInterval: 60
    },
    {
      id: "iot-002",
      equipmentId: "eq-002",
      name: "CT Scanner Monitoring Hub",
      status: 'online',
      batteryLevel: 67,
      signalStrength: 88,
      lastSyncTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      firmware: "v2.1.0",
      sensors: [
        { name: "Temperature", value: 68.2, unit: "°F" },
        { name: "Humidity", value: 52, unit: "%" },
        { name: "Vibration", value: 1.8, unit: "Hz" },
        { name: "Power", value: 210, unit: "W" }
      ],
      telemetryInterval: 120
    },
    {
      id: "iot-003",
      equipmentId: "eq-003",
      name: "Ultrasound IoT Gateway",
      status: 'offline',
      batteryLevel: 23,
      signalStrength: 0,
      lastSyncTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      firmware: "v1.9.2",
      sensors: [
        { name: "Temperature", value: 0, unit: "°F" },
        { name: "Humidity", value: 0, unit: "%" },
        { name: "Vibration", value: 0, unit: "Hz" },
        { name: "Power", value: 0, unit: "W" }
      ],
      telemetryInterval: 300
    }
  ];
  
  const selectedEquipment = selectedEquipmentId 
    ? equipmentData.find(eq => eq.id === selectedEquipmentId) 
    : null;
    
  const selectedDevice = selectedEquipmentId 
    ? iotDevices.find(device => device.equipmentId === selectedEquipmentId) 
    : null;
    
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate refresh delay
    setTimeout(() => {
      setTelemetryData(generateTimeSeriesData());
      setRefreshing(false);
      
      toast({
        title: "Data Refreshed",
        description: "IoT telemetry data has been updated.",
      });
    }, 1000);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <Select value={selectedEquipmentId || ""} onValueChange={onSelectEquipment}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select IoT-enabled equipment" />
            </SelectTrigger>
            <SelectContent>
              {equipmentData.map(equipment => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          className="border-red-200 text-red-600 hover:bg-red-50"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
      
      {selectedDevice ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50 py-3 px-6 border-b border-red-200">
                <CardTitle className="text-lg text-red-800">Device Status</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className={getStatusColor(selectedDevice.status)}>
                    {selectedDevice.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Battery Level</span>
                    <span className="text-sm">{selectedDevice.batteryLevel}%</span>
                  </div>
                  <Progress 
                    value={selectedDevice.batteryLevel}
                    className={`h-2 ${
                      selectedDevice.batteryLevel > 70 ? 'bg-green-100' : 
                      selectedDevice.batteryLevel > 30 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Signal Strength</span>
                    <span className="text-sm">{selectedDevice.signalStrength}%</span>
                  </div>
                  <Progress 
                    value={selectedDevice.signalStrength}
                    className={`h-2 ${
                      selectedDevice.signalStrength > 70 ? 'bg-green-100' : 
                      selectedDevice.signalStrength > 30 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}
                  />
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500">Last Sync</span>
                      <div className="font-medium">
                        {selectedDevice.lastSyncTime.toLocaleTimeString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Firmware</span>
                      <div className="font-medium">{selectedDevice.firmware}</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-sm font-medium mb-2 block">Sensor Readings</span>
                  <div className="space-y-2">
                    {selectedDevice.sensors.map((sensor, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm">{sensor.name}</span>
                        <span className="text-sm font-medium">
                          {sensor.value} {sensor.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-sm font-medium mb-2 block">Settings</span>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="telemetry-interval" className="text-sm">
                        Telemetry Interval
                      </Label>
                      <Select defaultValue={selectedDevice.telemetryInterval.toString()}>
                        <SelectTrigger className="w-[120px]" id="telemetry-interval">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 sec</SelectItem>
                          <SelectItem value="60">1 min</SelectItem>
                          <SelectItem value="300">5 min</SelectItem>
                          <SelectItem value="600">10 min</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alerts-enabled" className="text-sm">
                        Enable Alerts
                      </Label>
                      <Switch id="alerts-enabled" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="power-saving" className="text-sm">
                        Power Saving Mode
                      </Label>
                      <Switch id="power-saving" />
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Device
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50 py-3 px-6 border-b border-red-200 flex flex-row justify-between items-center">
                <CardTitle className="text-lg text-red-800">Telemetry Data</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`${activeChart === 'temperature' ? 'bg-red-100 border-red-200' : 'border-gray-200'}`}
                    onClick={() => setActiveChart('temperature')}
                  >
                    Temperature
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`${activeChart === 'vibration' ? 'bg-red-100 border-red-200' : 'border-gray-200'}`}
                    onClick={() => setActiveChart('vibration')}
                  >
                    Vibration
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`${activeChart === 'powerUsage' ? 'bg-red-100 border-red-200' : 'border-gray-200'}`}
                    onClick={() => setActiveChart('powerUsage')}
                  >
                    Power
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: 'white', borderColor: '#e5e7eb' }} />
                      <Legend />
                      {activeChart === 'temperature' && (
                        <Line 
                          type="monotone" 
                          dataKey="temperature" 
                          stroke="#dc2626" 
                          activeDot={{ r: 8 }} 
                          name="Temperature (°F)"
                        />
                      )}
                      {activeChart === 'vibration' && (
                        <Line 
                          type="monotone" 
                          dataKey="vibration" 
                          stroke="#2563eb" 
                          activeDot={{ r: 8 }} 
                          name="Vibration (Hz)"
                        />
                      )}
                      {activeChart === 'powerUsage' && (
                        <Line 
                          type="monotone" 
                          dataKey="powerUsage" 
                          stroke="#16a34a" 
                          activeDot={{ r: 8 }} 
                          name="Power (W)"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <Card className="border-red-100 bg-red-50">
                    <CardContent className="p-3">
                      <div className="text-xs text-gray-500">Current Temp</div>
                      <div className="text-lg font-bold text-red-600">
                        {telemetryData[telemetryData.length - 1].temperature}°F
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-blue-100 bg-blue-50">
                    <CardContent className="p-3">
                      <div className="text-xs text-gray-500">Vibration</div>
                      <div className="text-lg font-bold text-blue-600">
                        {telemetryData[telemetryData.length - 1].vibration}Hz
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-green-100 bg-green-50">
                    <CardContent className="p-3">
                      <div className="text-xs text-gray-500">Power</div>
                      <div className="text-lg font-bold text-green-600">
                        {telemetryData[telemetryData.length - 1].powerUsage}W
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-yellow-100 bg-yellow-50">
                    <CardContent className="p-3">
                      <div className="text-xs text-gray-500">Humidity</div>
                      <div className="text-lg font-bold text-yellow-600">
                        {telemetryData[telemetryData.length - 1].humidity}%
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-red-200">
              <CardHeader className="bg-red-50 py-3 px-6 border-b border-red-200">
                <CardTitle className="text-lg text-red-800">Remote Management</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 justify-start"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reboot Device
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 justify-start"
                    >
                      <Battery className="h-4 w-4 mr-2" />
                      Battery Diagnostics
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 justify-start"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Remote Configuration
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 justify-start"
                    >
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 justify-start"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Set Maintenance Schedule
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 justify-start"
                    >
                      <Link className="h-4 w-4 mr-2" />
                      Connect to Cloud
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="border-red-200">
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
            <Database className="h-16 w-16 text-red-300 mb-4" />
            <h3 className="text-xl font-medium text-red-800 mb-2">No IoT Device Selected</h3>
            <p className="text-gray-500 text-center mb-6">
              Select an equipment from the dropdown above to view its IoT integration data and controls.
            </p>
            <Button 
              variant="outline" 
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => onSelectEquipment(equipmentData[0].id)}
            >
              View Sample Device
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IoTIntegration;
