
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Settings, Bell, Zap } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useRealTimeTracking } from "@/hooks/use-real-time-tracking";
import ModernEquipmentCard from "@/components/tracking/ModernEquipmentCard";
import RealTimeMetrics from "@/components/tracking/RealTimeMetrics";
import IoTUsageTracker from "@/components/tracking/IoTUsageTracker";
import { Skeleton } from "@/components/ui/skeleton";

const EquipmentTracking = () => {
  const { 
    equipmentList, 
    selectedEquipmentId, 
    setSelectedEquipmentId,
    analytics,
    loading,
    refetch 
  } = useRealTimeTracking();

  const selectedEquipment = equipmentList.find(eq => eq.id === selectedEquipmentId);

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <div className="lg:col-span-3 space-y-4">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Equipment Tracking</h1>
            <p className="text-gray-600 mt-1">Monitor your equipment performance and usage in real-time</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleRefresh} variant="outline" size="sm" className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        {equipmentList.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Zap className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-[#333333] mb-2">No Equipment Found</h3>
              <p className="text-gray-600 mb-6">You don't have any equipment registered for tracking yet.</p>
              <Button className="bg-[#E02020] hover:bg-[#c01c1c] text-white">
                Add Equipment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-[#333333]">Your Equipment</CardTitle>
                  <p className="text-sm text-gray-600">{equipmentList.length} devices connected</p>
                </CardHeader>
                <CardContent className="pt-0 space-y-3 max-h-96 overflow-y-auto">
                  {equipmentList.map(equipment => (
                    <ModernEquipmentCard
                      key={equipment.id}
                      {...equipment}
                      isSelected={selectedEquipmentId === equipment.id}
                      onClick={() => setSelectedEquipmentId(equipment.id)}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              {selectedEquipment && (
                <>
                  <Card className="border-t-4 border-t-[#E02020]">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-[#333333]">{selectedEquipment.name}</CardTitle>
                          <p className="text-gray-600">{selectedEquipment.category} • {selectedEquipment.location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-green-600">
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">Live</span>
                          </div>
                          {selectedEquipment.remote_control_enabled && (
                            <Button size="sm" className="bg-[#E02020] hover:bg-[#c01c1c] text-white">
                              <Zap className="h-4 w-4 mr-1" />
                              Remote Control
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <Tabs defaultValue="metrics" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
                      <TabsTrigger 
                        value="metrics" 
                        className="data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-sm"
                      >
                        Real-time Metrics
                      </TabsTrigger>
                      <TabsTrigger 
                        value="iot" 
                        className="data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-sm"
                      >
                        IoT Data
                      </TabsTrigger>
                      <TabsTrigger 
                        value="alerts" 
                        className="data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-sm"
                      >
                        Alerts
                      </TabsTrigger>
                      <TabsTrigger 
                        value="settings" 
                        className="data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-sm"
                      >
                        Settings
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="metrics" className="mt-6">
                      <RealTimeMetrics 
                        analytics={analytics} 
                        equipmentName={selectedEquipment.name}
                      />
                    </TabsContent>
                    
                    <TabsContent value="iot" className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <IoTUsageTracker 
                          equipmentId={selectedEquipment.id}
                          pricePerUse={50}
                        />
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg font-semibold text-[#333333]">Device Sensors</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium">Temperature</span>
                                <span className="text-sm text-green-600">Normal (22°C)</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium">Vibration</span>
                                <span className="text-sm text-green-600">Normal</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium">Power Draw</span>
                                <span className="text-sm text-blue-600">85W</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="alerts" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-[#333333] flex items-center">
                            <Bell className="h-5 w-5 mr-2" />
                            Active Alerts
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-yellow-800">Maintenance Due</p>
                                  <p className="text-sm text-yellow-700">Regular maintenance is scheduled in 3 days</p>
                                </div>
                                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Medium</span>
                              </div>
                            </div>
                            
                            <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-green-800">All Systems Normal</p>
                                  <p className="text-sm text-green-700">Equipment is operating within normal parameters</p>
                                </div>
                                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Info</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="settings" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-[#333333]">Equipment Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-medium mb-2">Monitoring Preferences</h4>
                              <div className="space-y-2">
                                <label className="flex items-center">
                                  <input type="checkbox" className="mr-2" defaultChecked />
                                  Real-time data collection
                                </label>
                                <label className="flex items-center">
                                  <input type="checkbox" className="mr-2" defaultChecked />
                                  Alert notifications
                                </label>
                                <label className="flex items-center">
                                  <input type="checkbox" className="mr-2" />
                                  Predictive maintenance
                                </label>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Data Retention</h4>
                              <select className="w-full p-2 border rounded-md">
                                <option>30 days</option>
                                <option>90 days</option>
                                <option>1 year</option>
                              </select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EquipmentTracking;
