
import React, { useState } from 'react';
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
  ShoppingBag,
  MapPin,
  DollarSign,
  CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { inventoryData, manufacturerData } from '@/data/mockData';

// Mock data for leased products
const leasedProducts = [
  {
    id: '1',
    name: 'MRI Scanner XR-5000',
    customer: 'Central Hospital',
    cluster: 'North Medical',
    leaseStart: '2025-01-15',
    leaseEnd: '2026-01-15',
    monthlyRevenue: 2500
  },
  {
    id: '2',
    name: 'Ventilator Pro 2025',
    customer: 'St. Mary\'s Clinic',
    cluster: 'North Medical',
    leaseStart: '2025-02-20',
    leaseEnd: '2025-08-20',
    monthlyRevenue: 800
  },
  {
    id: '3',
    name: 'Surgical Robot Assistant XR-1',
    customer: 'University Hospital',
    cluster: 'South Consortium',
    leaseStart: '2025-03-10',
    leaseEnd: '2026-03-10',
    monthlyRevenue: 5000
  }
];

// Mock data for leased clusters
const leasedClusters = [
  {
    id: '1',
    name: 'North Medical',
    location: 'San Francisco, CA',
    hospitals: 5,
    equipmentLeased: 15,
    revenue: 12500
  },
  {
    id: '2',
    name: 'South Consortium',
    location: 'San Jose, CA',
    hospitals: 3,
    equipmentLeased: 8,
    revenue: 9000
  },
  {
    id: '3',
    name: 'East Alliance',
    location: 'Palo Alto, CA',
    hospitals: 2,
    equipmentLeased: 6,
    revenue: 5500
  }
];

// Mock data for payments
const paymentsReceived = [
  {
    id: '1',
    date: '2025-04-01',
    customer: 'Central Hospital',
    amount: 2500,
    status: 'Paid',
    invoiceId: 'INV-2025-001'
  },
  {
    id: '2',
    date: '2025-04-01',
    customer: 'St. Mary\'s Clinic',
    amount: 1600,
    status: 'Paid',
    invoiceId: 'INV-2025-002'
  },
  {
    id: '3',
    date: '2025-04-01',
    customer: 'University Hospital',
    amount: 5000,
    status: 'Pending',
    invoiceId: 'INV-2025-003'
  },
  {
    id: '4',
    date: '2025-03-01',
    customer: 'Central Hospital',
    amount: 2500,
    status: 'Paid',
    invoiceId: 'INV-2025-004'
  },
  {
    id: '5',
    date: '2025-03-01',
    customer: 'University Hospital',
    amount: 5000,
    status: 'Paid',
    invoiceId: 'INV-2025-005'
  }
];

const ManufacturerDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const totalMonthlyRevenue = leasedProducts.reduce((sum, product) => sum + product.monthlyRevenue, 0);
  const totalLeasedProducts = leasedProducts.length;
  const totalLeasedClusters = leasedClusters.length;

  return (
    <div className="p-6">
      <Tabs defaultValue="products" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="products" className="text-sm">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="clusters" className="text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              Clusters
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-sm">
              <DollarSign className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          {activeTab === 'products' && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>

        {/* Stats Cards - show on all tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold">${totalMonthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Leased Products</p>
                <p className="text-2xl font-bold">{totalLeasedProducts}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Leased Clusters</p>
                <p className="text-2xl font-bold">{totalLeasedClusters}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Tab */}
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
            
            {/* Leased Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>Leased Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Cluster</TableHead>
                      <TableHead>Lease Period</TableHead>
                      <TableHead className="text-right">Monthly Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leasedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.customer}</TableCell>
                        <TableCell>{product.cluster}</TableCell>
                        <TableCell>
                          {new Date(product.leaseStart).toLocaleDateString()} - 
                          {new Date(product.leaseEnd).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">${product.monthlyRevenue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Clusters Tab */}
        <TabsContent value="clusters">
          <Card>
            <CardHeader>
              <CardTitle>Leased Clusters</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cluster Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Hospitals</TableHead>
                    <TableHead>Equipment Leased</TableHead>
                    <TableHead className="text-right">Monthly Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leasedClusters.map((cluster) => (
                    <TableRow key={cluster.id}>
                      <TableCell className="font-medium">{cluster.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-2 text-gray-500" />
                          {cluster.location}
                        </div>
                      </TableCell>
                      <TableCell>{cluster.hospitals}</TableCell>
                      <TableCell>{cluster.equipmentLeased}</TableCell>
                      <TableCell className="text-right">${cluster.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments Received</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentsReceived.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.invoiceId}</TableCell>
                      <TableCell>{payment.customer}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === 'Paid' ? 'success' : 'outline'}>
                          {payment.status === 'Paid' && (
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          )}
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">${payment.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <h3 className="text-lg font-medium mb-1">Analytics Dashboard</h3>
              <p className="text-sm">View detailed analytics of product leasing performance.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManufacturerDashboard;
