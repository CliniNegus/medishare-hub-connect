import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Package, CircleDollarSign, Activity, MapPin, Plus, 
  FileSpreadsheet, BarChart2, Factory, AlertCircle, 
  Calendar, Truck, CheckCircle, ShoppingCart, Tag, 
  FileText, Filter, Store
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

// Define type for virtual shop
interface VirtualShop {
  id: string;
  name: string;
  country: string;
  equipment_count: number;
  revenue_generated: number;
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

  const [virtualShops, setVirtualShops] = useState<VirtualShop[]>([]);
  const [loadingShops, setLoadingShops] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [shopFilter, setShopFilter] = useState<'all' | 'disposable' | 'lease' | 'financing'>('all');

  useEffect(() => {
    if (user) {
      fetchVirtualShops();
    }
  }, [user]);
  
  const fetchVirtualShops = async () => {
    if (!user) return;
    
    try {
      setLoadingShops(true);
      
      // Get shops
      const { data: shopsData, error: shopsError } = await supabase
        .from('manufacturer_shops')
        .select('*')
        .eq('manufacturer_id', user.id)
        .limit(3);
      
      if (shopsError) throw shopsError;
      
      if (shopsData) {
        // For each shop, count equipment and calculate revenue
        const shopsWithStats = await Promise.all(
          shopsData.map(async (shop) => {
            const { count: equipmentCount } = await supabase
              .from('equipment')
              .select('*', { count: 'exact', head: true })
              .eq('shop_id', shop.id);
            
            const { data: revenueData } = await supabase
              .from('equipment')
              .select('revenue_generated')
              .eq('shop_id', shop.id);
            
            const revenueGenerated = revenueData?.reduce((sum, item) => 
              sum + (parseFloat(item.revenue_generated || 0)), 0) || 0;
            
            return {
              id: shop.id,
              name: shop.name,
              country: shop.country,
              equipment_count: equipmentCount || 0,
              revenue_generated: revenueGenerated
            };
          })
        );
        
        setVirtualShops(shopsWithStats);
      }
    } catch (error: any) {
      console.error('Error fetching virtual shops:', error.message);
      toast({
        variant: "destructive",
        title: "Error fetching shops",
        description: error.message,
      });
    } finally {
      setLoadingShops(false);
    }
  };

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
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
            onClick={() => navigate("/virtual-shops")}
          >
            <Store className="mr-2 h-4 w-4" />
            Manage Virtual Shops
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
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
                <Button type="submit" className="bg-red-600 hover:bg-red-700">Add Equipment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEquipment}</div>
            <p className="text-xs text-gray-500">Units in circulation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
            <CheckCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLease}</div>
            <p className="text-xs text-gray-500">Across multiple clusters</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.maintenance}</div>
            <p className="text-xs text-gray-500">Units in service</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Truck className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.available}</div>
            <p className="text-xs text-gray-500">Ready to deploy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.monthlyRevenue / 1000).toFixed(0)}k</div>
            <p className="text-xs text-gray-500">+5.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Virtual Shops Section */}
      <Card className="mb-8 border-red-100">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg flex items-center">
                <Store className="h-5 w-5 mr-2 text-red-600" />
                Virtual Shops
              </CardTitle>
              <CardDescription>
                Manage your equipment across different countries
              </CardDescription>
            </div>
            <Button 
              onClick={() => navigate('/virtual-shops')}
              className="bg-red-600 hover:bg-red-700"
            >
              View All Shops
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingShops ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : virtualShops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {virtualShops.map(shop => (
                <Card key={shop.id} className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">{shop.name}</CardTitle>
                    <CardDescription>{shop.country}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center mb-2 mt-2">
                      <div>
                        <p className="text-sm text-gray-500">Equipment</p>
                        <p className="font-semibold">{shop.equipment_count}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="font-semibold text-red-600">
                          ${shop.revenue_generated.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => navigate(`/products?shop=${shop.id}`)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Manage Equipment
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Store className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium mb-2">No Virtual Shops Yet</h3>
              <p className="text-gray-500 mb-4">Create your first virtual shop to start managing your equipment globally</p>
              <Button 
                onClick={() => navigate('/virtual-shops')}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Shop
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
