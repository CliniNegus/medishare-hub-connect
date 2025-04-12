
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Calendar, 
  Search, 
  Filter, 
  PlusCircle,
  StethoscopeIcon,
  HeartPulse,
  Clock,
  Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import EquipmentCard, { EquipmentProps } from './EquipmentCard';
import ClusterMap from './ClusterMap';
import BookingModal from './BookingModal';
import InvestorWallet from './InvestorWallet';

// Sample data for demonstration
const equipmentData: EquipmentProps[] = [
  {
    id: '1',
    name: 'MRI Scanner XR-5000',
    image: '/placeholder.svg',
    type: 'Imaging',
    location: 'Central Hospital',
    cluster: 'North Medical',
    status: 'available',
    pricePerUse: 500
  },
  {
    id: '2',
    name: 'Ventilator Pro 2022',
    image: '/placeholder.svg',
    type: 'Respiratory',
    location: 'St. Mary\'s Clinic',
    cluster: 'North Medical',
    status: 'in-use',
    pricePerUse: 120,
    nextAvailable: 'Tomorrow, 2PM'
  },
  {
    id: '3',
    name: 'Ultrasound Scanner',
    image: '/placeholder.svg',
    type: 'Imaging',
    location: 'Downtown Medical',
    cluster: 'West Network',
    status: 'available',
    pricePerUse: 250
  },
  {
    id: '4',
    name: 'Patient Monitor V8',
    image: '/placeholder.svg',
    type: 'Monitoring',
    location: 'Veterans Hospital',
    cluster: 'East Alliance',
    status: 'maintenance',
    pricePerUse: 80,
    nextAvailable: 'In 3 days'
  },
  {
    id: '5',
    name: 'Surgical Robot Assistant',
    image: '/placeholder.svg',
    type: 'Surgical',
    location: 'University Hospital',
    cluster: 'South Consortium',
    status: 'available',
    pricePerUse: 1200
  },
  {
    id: '6',
    name: 'Portable X-Ray System',
    image: '/placeholder.svg',
    type: 'Imaging',
    location: 'Community Health',
    cluster: 'West Network',
    status: 'in-use',
    pricePerUse: 150,
    nextAvailable: 'Today, 6PM'
  }
];

const clusterNodes = [
  { id: '1', name: 'Central Hospital', lat: 37.7749, lng: -122.4194, equipmentCount: 12, type: 'hospital' },
  { id: '2', name: 'St. Mary\'s Clinic', lat: 37.7833, lng: -122.4167, equipmentCount: 5, type: 'clinic' },
  { id: '3', name: 'Downtown Medical', lat: 37.7694, lng: -122.4862, equipmentCount: 8, type: 'hospital' },
  { id: '4', name: 'Veterans Hospital', lat: 37.7837, lng: -122.4324, equipmentCount: 15, type: 'hospital' },
  { id: '5', name: 'Community Health', lat: 37.7739, lng: -122.4312, equipmentCount: 3, type: 'clinic' },
];

const recentTransactions = [
  { id: '1', date: 'Apr 10, 2025', description: 'Investment Return - MRI Scanner', amount: 240, type: 'return' },
  { id: '2', date: 'Apr 07, 2025', description: 'Deposit to Investment Pool', amount: 5000, type: 'deposit' },
  { id: '3', date: 'Apr 05, 2025', description: 'Equipment Purchase - Ultrasound', amount: 1200, type: 'withdrawal' },
  { id: '4', date: 'Apr 02, 2025', description: 'Investment Return - Ventilators', amount: 320, type: 'return' },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClusterNode, setSelectedClusterNode] = useState<string | undefined>(undefined);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentProps | null>(null);

  const handleBookEquipment = (id: string) => {
    const equipment = equipmentData.find(eq => eq.id === id);
    if (equipment) {
      setSelectedEquipment(equipment);
      setBookingModalOpen(true);
    }
  };

  const handleConfirmBooking = (date: Date, duration: number, notes: string) => {
    console.log('Booking confirmed:', { equipment: selectedEquipment?.name, date, duration, notes });
    // In a real app, this would send a request to the backend to create a booking
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="equipment" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="equipment" className="text-sm">
              <StethoscopeIcon className="h-4 w-4 mr-2" />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="bookings" className="text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>

        <TabsContent value="equipment" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Filters and Equipment Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search equipment..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="in-use">In Use</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Available Equipment</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <StethoscopeIcon className="h-5 w-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Bookings</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Utilization Rate</p>
                      <p className="text-2xl font-bold">72%</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <HeartPulse className="h-5 w-5 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Equipment Cards */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Available Equipment</h2>
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated 5m ago
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {equipmentData.map(equipment => (
                    <EquipmentCard 
                      key={equipment.id} 
                      {...equipment} 
                      onBook={handleBookEquipment}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Map and Wallet */}
            <div className="space-y-6">
              <ClusterMap 
                nodes={clusterNodes} 
                selectedNodeId={selectedClusterNode}
                onSelectNode={setSelectedClusterNode}
              />
              
              <InvestorWallet 
                balance={25000}
                totalInvested={85000}
                returns={12650}
                returnsPercentage={14.9}
                recentTransactions={recentTransactions}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="bookings">
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <h3 className="text-lg font-medium mb-1">Booking Management</h3>
              <p className="text-sm">You can manage your equipment bookings here.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <h3 className="text-lg font-medium mb-1">Analytics Dashboard</h3>
              <p className="text-sm">View detailed analytics of equipment usage and revenue.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Booking Modal */}
      {selectedEquipment && (
        <BookingModal 
          isOpen={bookingModalOpen}
          equipmentName={selectedEquipment.name}
          pricePerUse={selectedEquipment.pricePerUse}
          onClose={() => setBookingModalOpen(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default Dashboard;
