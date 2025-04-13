
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, Bell, Calendar, Settings, 
  PlusCircle, FileText, BarChart2, Clock,
  Building, Activity, DollarSign, CreditCard
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data
  const stats = {
    hospitals: 28,
    manufacturers: 12,
    investors: 8,
    equipmentItems: 145,
    activeLeases: 87,
    pendingOrders: 14,
    maintenanceAlerts: 5,
    totalRevenue: 1250000
  };

  const recentEquipment = [
    { id: 'EQ001', name: 'MRI Scanner X9', manufacturer: 'MediTech', status: 'Leased', location: 'City Hospital' },
    { id: 'EQ002', name: 'CT Scanner Ultra', manufacturer: 'HealthImage', status: 'Available', location: 'Warehouse' },
    { id: 'EQ003', name: 'Portable X-Ray', manufacturer: 'RadiTech', status: 'Maintenance', location: 'Service Center' },
    { id: 'EQ004', name: 'Ultrasound Machine', manufacturer: 'SonoHealth', status: 'Leased', location: 'County Clinic' },
    { id: 'EQ005', name: 'Patient Monitor', manufacturer: 'VitalTech', status: 'Leased', location: 'Memorial Hospital' }
  ];

  const maintenanceSchedule = [
    { id: 'MS001', equipment: 'MRI Scanner X9', location: 'City Hospital', date: '2025-04-20', type: 'Preventive' },
    { id: 'MS002', equipment: 'CT Scanner Ultra', location: 'Warehouse', date: '2025-04-22', type: 'Calibration' },
    { id: 'MS003', equipment: 'Portable X-Ray', location: 'Service Center', date: '2025-04-18', type: 'Repair' },
    { id: 'MS004', equipment: 'Ultrasound Machine', location: 'County Clinic', date: '2025-04-25', type: 'Preventive' }
  ];

  const recentTransactions = [
    { id: 'TR001', date: '2025-04-12', description: 'Equipment Lease Payment', amount: 12500, type: 'Income' },
    { id: 'TR002', date: '2025-04-10', description: 'Maintenance Service Fee', amount: 1800, type: 'Income' },
    { id: 'TR003', date: '2025-04-09', description: 'Investor Dividend Payment', amount: 5200, type: 'Expense' },
    { id: 'TR004', date: '2025-04-07', description: 'New Equipment Purchase', amount: 78000, type: 'Expense' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white h-screen fixed">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 mr-2"></div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center p-2 rounded-md ${activeTab === 'overview' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                >
                  <BarChart2 className="h-5 w-5 mr-3" />
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('equipment')}
                  className={`w-full flex items-center p-2 rounded-md ${activeTab === 'equipment' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                >
                  <Package className="h-5 w-5 mr-3" />
                  Equipment
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center p-2 rounded-md ${activeTab === 'users' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                >
                  <Users className="h-5 w-5 mr-3" />
                  Users
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('maintenance')}
                  className={`w-full flex items-center p-2 rounded-md ${activeTab === 'maintenance' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                >
                  <Clock className="h-5 w-5 mr-3" />
                  Maintenance
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('finance')}
                  className={`w-full flex items-center p-2 rounded-md ${activeTab === 'finance' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                >
                  <DollarSign className="h-5 w-5 mr-3" />
                  Finance
                </button>
              </li>
            </ul>
            <div className="pt-8 border-t border-gray-800 mt-8">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center p-2 rounded-md ${activeTab === 'settings' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center p-2 rounded-md hover:bg-gray-800"
                  >
                    <FileText className="h-5 w-5 mr-3" />
                    Back to Home
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="ml-64 flex-1 p-6">
          <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Calendar className="h-5 w-5" />
              </Button>
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="font-medium text-gray-600">AB</span>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          {activeTab === 'overview' && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Hospitals</CardTitle>
                    <Building className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.hospitals}</div>
                    <p className="text-xs text-gray-500">+2 this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Equipment Items</CardTitle>
                    <Package className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.equipmentItems}</div>
                    <p className="text-xs text-gray-500">+12 this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
                    <Activity className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeLeases}</div>
                    <p className="text-xs text-gray-500">+7 this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(stats.totalRevenue / 1000).toFixed(0)}k</div>
                    <p className="text-xs text-gray-500">+8.2% from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Equipment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Equipment</DialogTitle>
                        <DialogDescription>
                          Enter the details of the new equipment item.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-gray-500">
                          Form fields would go here in a real implementation.
                        </p>
                      </div>
                      <DialogFooter>
                        <Button>Add Equipment</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Add User Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                          Enter the details of the new user account.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-gray-500">
                          User account creation form would go here.
                        </p>
                      </div>
                      <DialogFooter>
                        <Button>Add User</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Schedule Maintenance
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule Maintenance</DialogTitle>
                        <DialogDescription>
                          Create a new maintenance schedule.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-gray-500">
                          Maintenance scheduling form would go here.
                        </p>
                      </div>
                      <DialogFooter>
                        <Button>Schedule Maintenance</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={() => navigate('/dashboard')}
                  >
                    <BarChart2 className="h-4 w-4 mr-2" />
                    View User Dashboard
                  </Button>
                </div>
              </div>

              {/* Tabs for different data views */}
              <Tabs defaultValue="equipment" className="bg-white p-4 rounded-lg shadow-sm">
                <TabsList className="mb-4">
                  <TabsTrigger value="equipment">Recent Equipment</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance Schedule</TabsTrigger>
                  <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="equipment">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Manufacturer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentEquipment.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.manufacturer}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs 
                              ${item.status === 'Leased' ? 'bg-green-100 text-green-800' : 
                                item.status === 'Available' ? 'bg-blue-100 text-blue-800' : 
                                'bg-yellow-100 text-yellow-800'}`}>
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell>{item.location}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="maintenance">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {maintenanceSchedule.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.equipment}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs 
                              ${item.type === 'Preventive' ? 'bg-green-100 text-green-800' : 
                                item.type === 'Calibration' ? 'bg-blue-100 text-blue-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {item.type}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="transactions">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTransactions.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>${item.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs 
                              ${item.type === 'Income' ? 'bg-green-100 text-green-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {item.type}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Equipment Management</h2>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Equipment
                </Button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Equipment Categories</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Imaging Equipment (42 items)</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">MRI Scanners, CT Scanners, X-Ray Machines, Ultrasound Devices</p>
                      <Button variant="outline" size="sm">View All</Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Patient Monitoring (38 items)</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">Patient Monitors, ECG Machines, Vital Signs Monitors</p>
                      <Button variant="outline" size="sm">View All</Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Laboratory Equipment (25 items)</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">Analyzers, Centrifuges, Microscopes, Lab Automation Systems</p>
                      <Button variant="outline" size="sm">View All</Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Surgical Equipment (40 items)</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">Surgical Tables, Surgical Lights, Anesthesia Machines</p>
                      <Button variant="outline" size="sm">View All</Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">All Equipment</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEquipment.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.manufacturer}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs 
                          ${item.status === 'Leased' ? 'bg-green-100 text-green-800' : 
                            item.status === 'Available' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">User Management</h2>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">User Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Hospital Accounts</CardTitle>
                    <CardDescription>{stats.hospitals} active accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Manage Hospital Accounts</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Manufacturer Accounts</CardTitle>
                    <CardDescription>{stats.manufacturers} active accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Manage Manufacturer Accounts</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Investor Accounts</CardTitle>
                    <CardDescription>{stats.investors} active accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Manage Investor Accounts</Button>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Recently Active Users</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">USR001</TableCell>
                    <TableCell>Dr. Jennifer Smith</TableCell>
                    <TableCell>Hospital Admin</TableCell>
                    <TableCell>City Hospital</TableCell>
                    <TableCell>2 hours ago</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">USR002</TableCell>
                    <TableCell>Michael Johnson</TableCell>
                    <TableCell>Manufacturer Rep</TableCell>
                    <TableCell>MediTech</TableCell>
                    <TableCell>1 day ago</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">USR003</TableCell>
                    <TableCell>Sarah Williams</TableCell>
                    <TableCell>Investor</TableCell>
                    <TableCell>Health Ventures</TableCell>
                    <TableCell>3 days ago</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Maintenance Management</h2>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Maintenance Alerts</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
                  <h4 className="font-semibold text-yellow-700 mb-2">Equipment Requiring Immediate Attention: {stats.maintenanceAlerts}</h4>
                  <p className="text-yellow-600 mb-3">The following equipment items require immediate maintenance:</p>
                  <ul className="list-disc list-inside text-yellow-600 mb-3">
                    <li>MRI Scanner X9 (City Hospital) - Calibration Overdue</li>
                    <li>CT Scanner Ultra (Warehouse) - Preventive Maintenance Required</li>
                    <li>Patient Monitor X3 (Memorial Hospital) - Error Codes Reported</li>
                  </ul>
                  <Button variant="outline" size="sm">View All Alerts</Button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Upcoming Maintenance Schedule</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceSchedule.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.equipment}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs 
                          ${item.type === 'Preventive' ? 'bg-green-100 text-green-800' : 
                            item.type === 'Calibration' ? 'bg-blue-100 text-blue-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {item.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Cancel</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Financial Management</h2>
                <Button>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Record Transaction
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(stats.totalRevenue / 1000).toFixed(0)}k</div>
                    <p className="text-xs text-gray-500">+8.2% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
                    <Activity className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeLeases}</div>
                    <p className="text-xs text-gray-500">+7 this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                    <FileText className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">23</div>
                    <p className="text-xs text-gray-500">$189k outstanding</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
                    <BarChart2 className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">+$42k</div>
                    <p className="text-xs text-gray-500">This month</p>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>${item.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs 
                          ${item.type === 'Income' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {item.type}
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
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6">System Settings</h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">System Name</h4>
                      <p className="text-sm text-gray-500">Name of the application</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">CliniBuilds</p>
                      <Button variant="outline" size="sm" className="mt-2">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">Maintenance Reminder</h4>
                      <p className="text-sm text-gray-500">Days before maintenance to send reminder</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">7 days</p>
                      <Button variant="outline" size="sm" className="mt-2">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">System Currency</h4>
                      <p className="text-sm text-gray-500">Default currency for financial transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">USD ($)</p>
                      <Button variant="outline" size="sm" className="mt-2">Edit</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">User Permissions</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">Hospital Accounts</h4>
                      <p className="text-sm text-gray-500">Default permissions for hospital users</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">View, Order, Manage Inventory</p>
                      <Button variant="outline" size="sm" className="mt-2">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">Manufacturer Accounts</h4>
                      <p className="text-sm text-gray-500">Default permissions for manufacturer users</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">View, Manage Products, Maintenance</p>
                      <Button variant="outline" size="sm" className="mt-2">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">Investor Accounts</h4>
                      <p className="text-sm text-gray-500">Default permissions for investor users</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">View, Manage Investments</p>
                      <Button variant="outline" size="sm" className="mt-2">Edit</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">System Maintenance</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-2">Database Backup</h4>
                    <p className="text-sm text-gray-500 mb-4">Last backup: 2025-04-12 06:00 AM</p>
                    <Button>Run Manual Backup</Button>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-2">System Logs</h4>
                    <p className="text-sm text-gray-500 mb-4">View and download system logs for troubleshooting</p>
                    <Button>View System Logs</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
