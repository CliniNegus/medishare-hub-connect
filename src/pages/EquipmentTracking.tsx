
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
        <div className="container mx-auto py-12 px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <Skeleton className="h-10 w-60 mb-3" />
              <Skeleton className="h-5 w-80" />
            </div>
            <Skeleton className="h-12 w-40" />
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
            <div className="xl:col-span-3 space-y-6">
              <Skeleton className="h-[500px] w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-[#FFFFFF]">
        <div className="container mx-auto py-12 px-8 space-y-12">
          {/* Header Section with better spacing */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-[#333333]">Equipment Tracking</h1>
              <p className="text-lg text-gray-600 max-w-2xl">Monitor your equipment performance and usage in real-time</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                size="lg" 
                className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white px-6 py-3"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="lg" className="px-6 py-3">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Button>
            </div>
          </div>
          
          {equipmentList.length === 0 ? (
            <Card className="mx-auto max-w-2xl">
              <CardContent className="p-20 text-center">
                <div className="text-gray-400 mb-8">
                  <Zap className="h-24 w-24 mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-[#333333] mb-4">No Equipment Found</h3>
                <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                  You don't have any equipment registered for tracking yet.
                </p>
                <Button className="bg-[#E02020] hover:bg-[#c01c1c] text-white px-8 py-3 text-lg">
                  Add Equipment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
              {/* Equipment List Sidebar with better spacing */}
              <div className="xl:col-span-1">
                <Card className="h-fit shadow-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-xl font-semibold text-[#333333]">Your Equipment</CardTitle>
                    <p className="text-gray-600">{equipmentList.length} devices connected</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                      {equipmentList.map(equipment => (
                        <ModernEquipmentCard
                          key={equipment.id}
                          {...equipment}
                          isSelected={selectedEquipmentId === equipment.id}
                          onClick={() => setSelectedEquipmentId(equipment.id)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content Area with improved layout */}
              <div className="xl:col-span-3 space-y-10">
                {selectedEquipment && (
                  <>
                    {/* Equipment Header with better spacing */}
                    <Card className="border-t-4 border-t-[#E02020] shadow-sm">
                      <CardHeader className="py-8">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-2xl font-bold text-[#333333]">
                              {selectedEquipment.name}
                            </CardTitle>
                            <p className="text-gray-600 text-lg">
                              {selectedEquipment.category} • {selectedEquipment.location}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="font-medium">Live</span>
                            </div>
                            {selectedEquipment.remote_control_enabled && (
                              <Button size="lg" className="bg-[#E02020] hover:bg-[#c01c1c] text-white px-6 py-3">
                                <Zap className="h-5 w-5 mr-2" />
                                Remote Control
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    {/* Tabbed Content with improved spacing */}
                    <Tabs defaultValue="metrics" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-2 rounded-xl h-16 mb-10">
                        <TabsTrigger 
                          value="metrics" 
                          className="data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-sm font-medium text-base py-3"
                        >
                          Real-time Metrics
                        </TabsTrigger>
                        <TabsTrigger 
                          value="iot" 
                          className="data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-sm font-medium text-base py-3"
                        >
                          IoT Data
                        </TabsTrigger>
                        <TabsTrigger 
                          value="alerts" 
                          className="data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-sm font-medium text-base py-3"
                        >
                          Alerts
                        </TabsTrigger>
                        <TabsTrigger 
                          value="settings" 
                          className="data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-sm font-medium text-base py-3"
                        >
                          Settings
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="metrics">
                        <RealTimeMetrics 
                          analytics={analytics} 
                          equipmentName={selectedEquipment.name}
                        />
                      </TabsContent>
                      
                      <TabsContent value="iot">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                          <IoTUsageTracker 
                            equipmentId={selectedEquipment.id}
                            pricePerUse={50}
                          />
                          <Card className="shadow-sm">
                            <CardHeader className="pb-6">
                              <CardTitle className="text-xl font-semibold text-[#333333]">Device Sensors</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-6">
                                <div className="flex justify-between items-center p-6 bg-gray-50 rounded-xl">
                                  <span className="font-medium text-[#333333]">Temperature</span>
                                  <span className="text-green-600 font-medium">Normal (22°C)</span>
                                </div>
                                <div className="flex justify-between items-center p-6 bg-gray-50 rounded-xl">
                                  <span className="font-medium text-[#333333]">Vibration</span>
                                  <span className="text-green-600 font-medium">Normal</span>
                                </div>
                                <div className="flex justify-between items-center p-6 bg-gray-50 rounded-xl">
                                  <span className="font-medium text-[#333333]">Power Draw</span>
                                  <span className="text-blue-600 font-medium">85W</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="alerts">
                        <Card className="shadow-sm">
                          <CardHeader className="pb-6">
                            <CardTitle className="text-xl font-semibold text-[#333333] flex items-center">
                              <Bell className="h-6 w-6 mr-3 text-[#E02020]" />
                              Active Alerts
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-8">
                              <div className="p-8 border border-yellow-200 bg-yellow-50 rounded-xl">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold text-yellow-800 mb-2 text-lg">Maintenance Due</p>
                                    <p className="text-yellow-700">Regular maintenance is scheduled in 3 days</p>
                                  </div>
                                  <span className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full font-medium">
                                    Medium
                                  </span>
                                </div>
                              </div>
                              
                              <div className="p-8 border border-green-200 bg-green-50 rounded-xl">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold text-green-800 mb-2 text-lg">All Systems Normal</p>
                                    <p className="text-green-700">Equipment is operating within normal parameters</p>
                                  </div>
                                  <span className="bg-green-200 text-green-800 px-4 py-2 rounded-full font-medium">
                                    Info
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="settings">
                        <Card className="shadow-sm">
                          <CardHeader className="pb-6">
                            <CardTitle className="text-xl font-semibold text-[#333333]">Equipment Settings</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-10">
                              <div>
                                <h4 className="font-semibold mb-6 text-[#333333] text-lg">Monitoring Preferences</h4>
                                <div className="space-y-5">
                                  <label className="flex items-center space-x-4 text-base">
                                    <input type="checkbox" className="mr-3 text-[#E02020] scale-125" defaultChecked />
                                    <span>Real-time data collection</span>
                                  </label>
                                  <label className="flex items-center space-x-4 text-base">
                                    <input type="checkbox" className="mr-3 text-[#E02020] scale-125" defaultChecked />
                                    <span>Alert notifications</span>
                                  </label>
                                  <label className="flex items-center space-x-4 text-base">
                                    <input type="checkbox" className="mr-3 text-[#E02020] scale-125" />
                                    <span>Predictive maintenance</span>
                                  </label>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-6 text-[#333333] text-lg">Data Retention</h4>
                                <select className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#E02020] focus:border-transparent text-base">
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
      </div>
    </Layout>
  );
};

export default EquipmentTracking;
