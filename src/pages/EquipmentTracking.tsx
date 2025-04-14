
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, RefreshCw } from "lucide-react";
import { Layout } from "@/components/Layout";
import IoTDeviceStatus from "@/components/tracking/IoTDeviceStatus";
import UsageChart from "@/components/tracking/UsageChart";
import { useIoTData } from "@/hooks/useIoTData";
import { inventoryData } from "@/data/mockData";

const EquipmentTracking = () => {
  const [selectedEquipment, setSelectedEquipment] = useState(inventoryData[0].id);
  
  // Use our IoT data hook
  const { device, usageData, loading, error } = useIoTData(selectedEquipment);
  
  const handleRefresh = () => {
    // In a real application, this would trigger a refresh of the IoT data
    window.location.reload();
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Equipment Tracking</h1>
            <p className="text-gray-500">Monitor equipment status and usage in real-time</p>
          </div>
          <Button onClick={handleRefresh} className="self-start" variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Connected Equipment</h2>
                <div className="space-y-2">
                  {inventoryData.map(item => (
                    <Button 
                      key={item.id}
                      variant={selectedEquipment === item.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedEquipment(item.id)}
                    >
                      <div className="w-8 h-8 mr-2 bg-gray-100 rounded flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">ID: {item.sku}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            ) : device ? (
              <IoTDeviceStatus 
                deviceId={device.deviceId}
                equipmentName={device.equipmentName}
                status={device.status}
                lastActive={new Date(device.lastActive).toLocaleString()}
                batteryLevel={device.batteryLevel}
                signalStrength={device.signalStrength}
                location={device.location}
                usageData={device.usageData}
              />
            ) : null}
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="realtime" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="realtime">Real-time Data</TabsTrigger>
                <TabsTrigger value="daily">Daily Summary</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="realtime" className="space-y-6">
                {loading ? (
                  <div className="flex justify-center p-12">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <UsageChart 
                      data={usageData} 
                      title="Real-time Usage Metrics"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-gray-500">Current Status</p>
                          <p className={`text-xl font-bold ${
                            device?.status === 'online' ? 'text-green-600' : 
                            device?.status === 'standby' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {device?.status.toUpperCase()}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-gray-500">Power Usage</p>
                          <p className="text-xl font-bold">
                            {usageData.length > 0 ? `${usageData[usageData.length - 1].powerUsage}W` : 'N/A'}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-gray-500">Temperature</p>
                          <p className="text-xl font-bold">
                            {usageData.length > 0 ? `${usageData[usageData.length - 1].temperature}°C` : 'N/A'}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="daily">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Daily Usage Summary</h3>
                    <p className="text-gray-500">
                      View detailed daily usage statistics for this equipment. This section would include
                      aggregated data showing patterns of usage throughout the day.
                    </p>
                    <div className="h-64 flex items-center justify-center border rounded-md mt-4 bg-gray-50">
                      <p className="text-gray-400">Daily usage chart would appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="alerts">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">System Alerts</h3>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md bg-yellow-50">
                        <p className="font-medium text-yellow-800">Maintenance Due</p>
                        <p className="text-sm text-yellow-700">
                          Regular maintenance is scheduled for this equipment in 5 days.
                        </p>
                      </div>
                      <div className="p-4 border rounded-md">
                        <p className="font-medium">No Critical Alerts</p>
                        <p className="text-sm text-gray-500">
                          This equipment is currently operating within normal parameters.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Integration Settings</h3>
                <p className="text-gray-500 mb-4">
                  Configure how this equipment connects to your IoT platform. You can set up alerts,
                  adjust data collection intervals, and manage sensor configurations.
                </p>
                <Button variant="outline">Configure IoT Integration</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EquipmentTracking;
