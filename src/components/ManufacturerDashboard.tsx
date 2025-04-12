
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Package, 
  TruckIcon, 
  Factory, 
  Plus,
  Search,
  Filter,
  ShoppingBag
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ManufacturerDashboard = () => {
  return (
    <div className="p-6">
      <Tabs defaultValue="products" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="products" className="text-sm">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-sm">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <TabsContent value="products" className="mt-0">
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Products</p>
                    <p className="text-2xl font-bold">32</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pending Orders</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <TruckIcon className="h-5 w-5 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Production Capacity</p>
                    <p className="text-2xl font-bold">78%</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Factory className="h-5 w-5 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products List Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Product Catalog</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Manage Your Products</h3>
                  <p className="text-sm text-gray-500 mb-4">Add, edit, and track your medical equipment inventory from here.</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <ShoppingBag className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <h3 className="text-lg font-medium mb-1">Orders Dashboard</h3>
              <p className="text-sm">Manage your incoming and outgoing orders here.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <h3 className="text-lg font-medium mb-1">Analytics Dashboard</h3>
              <p className="text-sm">View detailed analytics of product sales and performance.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManufacturerDashboard;
