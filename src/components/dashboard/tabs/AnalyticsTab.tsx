import React from 'react';
import { BarChart, PieChart, Activity, Users, Package, RefreshCw, Share2, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-red-600">Equipment Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="text-gray-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
          <Button variant="outline" size="sm" className="text-gray-600">
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
            <div className="text-2xl font-bold text-red-600">145</div>
            <p className="text-xs text-gray-500">Across all hospitals</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Leases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">87</div>
            <p className="text-xs text-gray-500">60% utilization</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Maintenance Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12</div>
            <p className="text-xs text-gray-500">8% of inventory</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$1.2M</div>
            <p className="text-xs text-gray-500">+15% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-red-600" />
              Equipment Usage by Category
            </CardTitle>
            <CardDescription>
              Distribution of equipment usage across different categories
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Equipment usage charts would be displayed here</p>
              <p className="text-sm text-gray-400">Showing usage metrics across all categories</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-red-600" />
              Equipment Distribution
            </CardTitle>
            <CardDescription>
              Allocation of equipment across different hospitals
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Distribution charts would be displayed here</p>
              <p className="text-sm text-gray-400">Showing allocation across all hospital clusters</p>
            </div>
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
                <SelectValue placeholder="Select cluster" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clusters</SelectItem>
                <SelectItem value="northeast">Northeast Medical</SelectItem>
                <SelectItem value="midwest">Midwest Hospitals</SelectItem>
                <SelectItem value="west">West Coast Network</SelectItem>
                <SelectItem value="south">Southern Medical Group</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <div className="bg-green-500 h-3 w-3 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium">Hospital Dashboards</h4>
                  <p className="text-sm text-gray-500">All 28 hospitals synchronized</p>
                </div>
              </div>
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span>Synced 2 minutes ago</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <div className="bg-green-500 h-3 w-3 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium">Manufacturer Dashboards</h4>
                  <p className="text-sm text-gray-500">All 12 manufacturers synchronized</p>
                </div>
              </div>
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span>Synced 5 minutes ago</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center">
                <div className="bg-yellow-500 h-3 w-3 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium">Inventory Management</h4>
                  <p className="text-sm text-gray-500">7 of 8 clusters synchronized</p>
                </div>
              </div>
              <div className="flex items-center text-yellow-600">
                <AlertCircle className="h-5 w-5 mr-1" />
                <span>Syncing in progress...</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <div className="bg-green-500 h-3 w-3 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium">Admin Dashboard</h4>
                  <p className="text-sm text-gray-500">All data synchronized</p>
                </div>
              </div>
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span>Synced 1 minute ago</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Last full synchronization: April 18, 2025 at 09:45 AM
              </div>
              <Button className="bg-red-600 hover:bg-red-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Force Full Sync
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Multi-User Access Management</CardTitle>
          <CardDescription className="text-red-700">
            Manage user access and permissions for hospital equipment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Users className="h-12 w-12 mx-auto mb-3 text-red-600" />
            <h3 className="text-lg font-medium mb-2 text-red-800">Enable Multiple Users Per Hospital</h3>
            <p className="text-sm text-red-700 max-w-md mx-auto mb-4">
              Configure roles and permissions for different hospital staff members to access
              and manage equipment based on their responsibilities.
            </p>
            <Button className="bg-red-600 hover:bg-red-700">
              Configure User Access
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
