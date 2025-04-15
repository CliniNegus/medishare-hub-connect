import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Package, CircleDollarSign, Activity, MapPin, Plus, 
  FileSpreadsheet, BarChart2, Factory, AlertCircle, 
  Calendar, Truck, CheckCircle, ShoppingCart, Tag, 
  FileText, Filter
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

// Define type for leased products
interface LeasedProduct {
  id: string;
  name: string;
  model: string;
  hospital: string;
  leaseDate: string;
  leaseEnd: string;
  status: 'active' | 'maintenance' | 'expired';
}

// Define type for cluster locations
interface ClusterLocation {
  id: string;
  name: string;
  location: string;
  hospitals: number;
  equipmentCount: number;
  status: 'operational' | 'issue';
}

// Define type for payments received
interface PaymentReceived {
  id: string;
  date: string;
  hospital: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  equipment: string;
}

// Define type for shop products
interface ShopProduct {
  id: string;
  name: string;
  type: 'disposable' | 'lease' | 'financing';
  price: number;
  stock: number;
  status: 'active' | 'inactive';
}

const ManufacturerDashboard = () => {
  // Sample data - this would come from an API in a real application
  const leasedProducts: LeasedProduct[] = [
    {
      id: 'PROD-001',
      name: 'MRI Scanner X9',
      model: '2023-XR',
      hospital: 'City Hospital',
      leaseDate: '2024-10-15',
      leaseEnd: '2027-10-15',
      status: 'active'
    },
    {
      id: 'PROD-002',
      name: 'CT Scanner Ultra',
      model: 'CT-2000',
      hospital: 'Memorial Medical Center',
      leaseDate: '2024-08-22',
      leaseEnd: '2026-08-22',
      status: 'active'
    },
    {
      id: 'PROD-003',
      name: 'Patient Monitor Elite',
      model: 'PM-500',
      hospital: 'County Clinic',
      leaseDate: '2024-11-30',
      leaseEnd: '2025-11-30',
      status: 'active'
    },
    {
      id: 'PROD-004',
      name: 'X-Ray Machine',
      model: 'XR-100',
      hospital: 'University Hospital',
      leaseDate: '2023-05-12',
      leaseEnd: '2025-05-12',
      status: 'maintenance'
    },
    {
      id: 'PROD-005',
      name: 'Ultrasound Unit',
      model: 'US-300',
      hospital: 'Children\'s Hospital',
      leaseDate: '2024-01-10',
      leaseEnd: '2026-01-10',
      status: 'active'
    }
  ];

  const clusterLocations: ClusterLocation[] = [
    {
      id: 'CLST-001',
      name: 'Northeast Medical Cluster',
      location: 'Boston, MA',
      hospitals: 5,
      equipmentCount: 18,
      status: 'operational'
    },
    {
      id: 'CLST-002',
      name: 'West Coast Health Network',
      location: 'San Francisco, CA',
      hospitals: 7,
      equipmentCount: 24,
      status: 'operational'
    },
    {
      id: 'CLST-003',
      name: 'Southern Medical Group',
      location: 'Atlanta, GA',
      hospitals: 4,
      equipmentCount: 12,
      status: 'issue'
    },
    {
      id: 'CLST-004',
      name: 'Midwest Hospital Alliance',
      location: 'Chicago, IL',
      hospitals: 6,
      equipmentCount: 20,
      status: 'operational'
    }
  ];

  const paymentsReceived: PaymentReceived[] = [
    {
      id: 'PMT-001',
      date: '2025-04-05',
      hospital: 'City Hospital',
      amount: 12500,
      status: 'paid',
      equipment: 'MRI Scanner X9'
    },
    {
      id: 'PMT-002',
      date: '2025-04-02',
      hospital: 'Memorial Medical Center',
      amount: 8750,
      status: 'paid',
      equipment: 'CT Scanner Ultra'
    },
    {
      id: 'PMT-003',
      date: '2025-03-28',
      hospital: 'County Clinic',
      amount: 3200,
      status: 'pending',
      equipment: 'Patient Monitor Elite'
    },
    {
      id: 'PMT-004',
      date: '2025-03-25',
      hospital: 'University Hospital',
      amount: 4800,
      status: 'overdue',
      equipment: 'X-Ray Machine'
    },
    {
      id: 'PMT-005',
      date: '2025-03-22',
      hospital: 'Children\'s Hospital',
      amount: 5600,
      status: 'paid',
      equipment: 'Ultrasound Unit'
    }
  ];

  const shopProducts: ShopProduct[] = [
    {
      id: 'SHOP-001',
      name: 'Surgical Gloves (Box of 100)',
      type: 'disposable',
      price: 24.99,
      stock: 150,
      status: 'active'
    },
    {
      id: 'SHOP-002',
      name: 'Patient Monitors',
      type: 'lease',
      price: 599.99,
      stock: 12,
      status: 'active'
    },
    {
      id: 'SHOP-003',
      name: 'MRI Scanner Pro',
      type: 'financing',
      price: 450000,
      stock: 3,
      status: 'active'
    },
    {
      id: 'SHOP-004',
      name: 'Surgical Masks (Box of 50)',
      type: 'disposable',
      price: 19.99,
      stock: 200,
      status: 'active'
    },
    {
      id: 'SHOP-005',
      name: 'Ultrasound Machine',
      type: 'lease',
      price: 28000,
      stock: 8,
      status: 'active'
    },
    {
      id: 'SHOP-006',
      name: 'CT Scanner',
      type: 'financing',
      price: 320000,
      stock: 2,
      status: 'active'
    }
  ];

  const stats = {
    totalEquipment: 72,
    activeLease: 56,
    maintenance: 8,
    available: 8,
    monthlyRevenue: 124500
  };

  const [activeTab, setActiveTab] = useState('products');
  const [shopFilter, setShopFilter] = useState<'all' | 'disposable' | 'lease' | 'financing'>('all');
  
  const { profile, user } = useAuth();

  const filteredShopProducts = shopFilter === 'all' 
    ? shopProducts 
    : shopProducts.filter(product => product.type === shopFilter);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manufacturer Dashboard</h1>
          {profile && (
            <p className="text-gray-600">
              {profile.full_name || user?.email} {profile.organization && `• ${profile.organization}`}
            </p>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medical Equipment</DialogTitle>
              <DialogDescription>
                Enter the details for new equipment to be added to your inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-500 mb-4">
                Form fields would go here in a real implementation.
              </p>
            </div>
            <DialogFooter>
              <Button type="submit">Add Equipment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEquipment}</div>
            <p className="text-xs text-gray-500">Units in circulation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLease}</div>
            <p className="text-xs text-gray-500">Across {clusterLocations.length} clusters</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.maintenance}</div>
            <p className="text-xs text-gray-500">Units in service</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Truck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.available}</div>
            <p className="text-xs text-gray-500">Ready to deploy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.monthlyRevenue / 1000).toFixed(0)}k</div>
            <p className="text-xs text-gray-500">+5.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="products" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
        <TabsList>
          <TabsTrigger value="products" className="text-sm">
            <Package className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="clusters" className="text-sm">
            <MapPin className="h-4 w-4 mr-2" />
            Clusters
          </TabsTrigger>
          <TabsTrigger value="shop" className="text-sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Shop Management
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-sm">
            <CircleDollarSign className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm">
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Leased Products</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Lease Date</TableHead>
                  <TableHead>Lease End</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leasedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.model}</TableCell>
                    <TableCell>{product.hospital}</TableCell>
                    <TableCell>{product.leaseDate}</TableCell>
                    <TableCell>{product.leaseEnd}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${product.status === 'active' ? 'bg-green-100 text-green-800' : 
                          product.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="clusters" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Cluster Locations</h2>
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                View Map
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cluster Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Hospitals</TableHead>
                  <TableHead>Equipment Count</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clusterLocations.map((cluster) => (
                  <TableRow key={cluster.id}>
                    <TableCell className="font-medium">{cluster.id}</TableCell>
                    <TableCell>{cluster.name}</TableCell>
                    <TableCell>{cluster.location}</TableCell>
                    <TableCell>{cluster.hospitals}</TableCell>
                    <TableCell>{cluster.equipmentCount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${cluster.status === 'operational' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {cluster.status.charAt(0).toUpperCase() + cluster.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Details</Button>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="shop" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Shop Products Management</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Catalog
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
            
            <div className="mb-6 flex items-center">
              <div className="text-sm font-medium mr-4">Filter by type:</div>
              <div className="flex space-x-2">
                <Button 
                  variant={shopFilter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setShopFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={shopFilter === 'disposable' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setShopFilter('disposable')}
                >
                  Disposables
                </Button>
                <Button 
                  variant={shopFilter === 'lease' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setShopFilter('lease')}
                >
                  Lease Equipment
                </Button>
                <Button 
                  variant={shopFilter === 'financing' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setShopFilter('financing')}
                >
                  Financing Options
                </Button>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShopProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${product.type === 'disposable' ? 'bg-blue-100 text-blue-800' : 
                          product.type === 'lease' ? 'bg-purple-100 text-purple-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>${product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${product.status === 'active' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">Remove</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Payments Received</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentsReceived.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.hospital}</TableCell>
                    <TableCell>{payment.equipment}</TableCell>
                    <TableCell>${payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Details</Button>
                        <Button variant="outline" size="sm">Invoice</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Analytics Dashboard</h2>
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <div className="text-center">
                <BarChart2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Analytics charts would be displayed here in a real implementation.</p>
                <p className="text-gray-500 text-sm mt-2">Including revenue trends, leased equipment distribution, and maintenance statistics.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManufacturerDashboard;
