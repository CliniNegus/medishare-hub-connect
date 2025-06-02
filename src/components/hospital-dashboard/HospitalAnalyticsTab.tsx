
import React from 'react';
import { BarChart, PieChart, Activity, Users, Package, RefreshCw, Share2, Download, CheckCircle, AlertCircle, Settings, UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHospitalAnalytics } from '@/hooks/use-hospital-analytics';
import { useToast } from '@/hooks/use-toast';

const HospitalAnalyticsTab: React.FC = () => {
  const { analytics, loading, syncData, exportData, forceSyncAll } = useHospitalAnalytics();
  const { toast } = useToast();

  const handleSyncData = async () => {
    await syncData();
    toast({
      title: "Data Synchronized",
      description: "Analytics data has been refreshed successfully.",
    });
  };

  const handleExportData = () => {
    exportData();
    toast({
      title: "Data Exported",
      description: "Analytics data has been exported to CSV.",
    });
  };

  const handleForceSyncAll = async () => {
    await forceSyncAll();
    toast({
      title: "Full Sync Initiated",
      description: "All systems are being synchronized...",
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'synced': return 'text-green-600';
      case 'syncing': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'synced': return CheckCircle;
      case 'syncing': return RefreshCw;
      case 'error': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const formatLastSync = (lastSync: string) => {
    const diff = Date.now() - new Date(lastSync).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#E02020]">Equipment Analytics Dashboard</h2>
          <div className="flex space-x-2">
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-8 bg-gray-200 animate-pulse rounded mb-1"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#E02020]">Equipment Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="text-gray-600" onClick={handleSyncData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
          <Button variant="outline" size="sm" className="text-gray-600" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E02020]">{analytics.totalEquipment}</div>
            <p className="text-xs text-gray-500">Across all locations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Leases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E02020]">{analytics.activeLeases}</div>
            <p className="text-xs text-gray-500">{analytics.utilizationRate.toFixed(1)}% utilization</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Maintenance Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E02020]">{analytics.maintenanceItems}</div>
            <p className="text-xs text-gray-500">
              {analytics.totalEquipment > 0 
                ? `${((analytics.maintenanceItems / analytics.totalEquipment) * 100).toFixed(1)}% of inventory`
                : '0% of inventory'
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E02020]">${analytics.revenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Total from bookings</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-[#E02020]" />
              Equipment Usage by Category
            </CardTitle>
            <CardDescription>
              Distribution of equipment usage across different categories
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {analytics.equipmentByCategory.length > 0 ? (
              <div className="space-y-3">
                {analytics.equipmentByCategory.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{category.category}</span>
                        <span className="text-gray-500">{category.count} units</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#E02020] h-2 rounded-full" 
                          style={{ width: `${Math.min((category.usage / 1000) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {category.usage} hours used
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <div>
                  <BarChart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No equipment data available</p>
                  <p className="text-sm text-gray-400">Equipment usage will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-[#E02020]" />
              Equipment Distribution
            </CardTitle>
            <CardDescription>
              Allocation of equipment across different locations
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {analytics.equipmentDistribution.length > 0 ? (
              <div className="space-y-3">
                {analytics.equipmentDistribution.map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{location.location}</span>
                        <span className="text-gray-500">{location.count} units</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#E02020] h-2 rounded-full" 
                          style={{ 
                            width: `${analytics.totalEquipment > 0 
                              ? (location.count / analytics.totalEquipment) * 100 
                              : 0}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {analytics.totalEquipment > 0 
                          ? `${((location.count / analytics.totalEquipment) * 100).toFixed(1)}% of total`
                          : '0% of total'
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <div>
                  <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No location data available</p>
                  <p className="text-sm text-gray-400">Equipment distribution will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Real-time Synchronization Status</CardTitle>
              <CardDescription>
                Monitor the synchronization status of equipment data across all dashboards
              </CardDescription>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Systems</SelectItem>
                <SelectItem value="equipment">Equipment Data</SelectItem>
                <SelectItem value="bookings">Booking System</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {analytics.syncStatus.map((status, index) => {
              const StatusIcon = getStatusIcon(status.status);
              return (
                <div key={index} className={`flex items-center justify-between p-3 border rounded-md ${
                  status.status === 'synced' ? 'bg-green-50 border-green-200' :
                  status.status === 'syncing' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-3 ${
                      status.status === 'synced' ? 'bg-green-500' :
                      status.status === 'syncing' ? 'bg-yellow-500' :
                      'bg-red-500'
                    } ${status.status === 'syncing' ? 'animate-pulse' : ''}`}></div>
                    <div>
                      <h4 className="font-medium">{status.system}</h4>
                      <p className="text-sm text-gray-500">
                        {status.status === 'synced' ? 'All data synchronized' :
                         status.status === 'syncing' ? 'Synchronization in progress' :
                         'Synchronization failed'}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center ${getStatusColor(status.status)}`}>
                    <StatusIcon className={`h-5 w-5 mr-1 ${status.status === 'syncing' ? 'animate-spin' : ''}`} />
                    <span>
                      {status.status === 'synced' ? `Synced ${formatLastSync(status.lastSync)}` :
                       status.status === 'syncing' ? 'Syncing...' :
                       'Error occurred'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Last full synchronization: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <Button 
                className="bg-[#E02020] hover:bg-[#c01c1c]"
                onClick={handleForceSyncAll}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Force Full Sync
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-[#E02020]/20 bg-[#E02020]/5">
        <CardHeader>
          <CardTitle className="text-[#E02020] flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Multi-User Access Management
          </CardTitle>
          <CardDescription className="text-[#E02020]/80">
            Manage user access and permissions for hospital equipment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <UserCog className="h-12 w-12 mx-auto mb-3 text-[#E02020]" />
            <h3 className="text-lg font-medium mb-2 text-[#E02020]">Enable Multiple Users Per Hospital</h3>
            <p className="text-sm text-[#E02020]/80 max-w-md mx-auto mb-4">
              Configure roles and permissions for different hospital staff members to access
              and manage equipment based on their responsibilities.
            </p>
            <Button className="bg-[#E02020] hover:bg-[#c01c1c] text-white">
              <Settings className="h-4 w-4 mr-2" />
              Configure User Access
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalAnalyticsTab;
