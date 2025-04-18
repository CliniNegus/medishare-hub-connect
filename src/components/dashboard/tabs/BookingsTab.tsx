
import React, { useState } from 'react';
import { Calendar, Users, Clock, AlertCircle, Filter, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data - in a real implementation, this would come from your database
const bookings = [
  { 
    id: 'BK001', 
    equipment: 'MRI Scanner X5', 
    hospital: 'City General Hospital',
    startDate: '2025-04-20', 
    endDate: '2025-07-20',
    status: 'active',
    paymentStatus: 'current',
    users: ['Dr. Smith', 'Dr. Johnson']
  },
  { 
    id: 'BK002', 
    equipment: 'CT Scanner Pro', 
    hospital: 'Memorial Medical Center',
    startDate: '2025-04-15', 
    endDate: '2025-10-15',
    status: 'active',
    paymentStatus: 'current',
    users: ['Dr. Williams', 'Dr. Davis', 'Dr. Miller']
  },
  { 
    id: 'BK003', 
    equipment: 'Ultrasound Machine', 
    hospital: 'County Clinic',
    startDate: '2025-04-10', 
    endDate: '2025-05-10',
    status: 'pending',
    paymentStatus: 'awaiting',
    users: ['Dr. Brown']
  },
  { 
    id: 'BK004', 
    equipment: 'X-Ray System', 
    hospital: 'University Hospital',
    startDate: '2025-03-25', 
    endDate: '2025-06-25',
    status: 'completed',
    paymentStatus: 'paid',
    users: ['Dr. Taylor', 'Dr. Anderson']
  }
];

const BookingsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500">Currently in use</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <p className="text-xs text-gray-500">Awaiting approval</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.status === 'completed').length}
            </div>
            <p className="text-xs text-gray-500">Historical usage</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {[...new Set(bookings.flatMap(b => b.users))].length}
            </div>
            <p className="text-xs text-gray-500">Across all bookings</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle>Equipment Bookings</CardTitle>
            <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
              <Calendar className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              Showing {filteredBookings.length} bookings
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No bookings found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map(booking => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>{booking.equipment}</TableCell>
                      <TableCell>{booking.hospital}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          <span>
                            {booking.startDate} to {booking.endDate}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{booking.users.length} users</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {booking.status === 'active' && (
                            <Badge className="bg-green-500">Active</Badge>
                          )}
                          {booking.status === 'pending' && (
                            <Badge className="bg-yellow-500">Pending</Badge>
                          )}
                          {booking.status === 'completed' && (
                            <Badge className="bg-gray-500">Completed</Badge>
                          )}
                          
                          {booking.paymentStatus === 'current' && (
                            <Badge className="ml-2 bg-green-100 text-green-800">Paid</Badge>
                          )}
                          {booking.paymentStatus === 'awaiting' && (
                            <Badge className="ml-2 bg-yellow-100 text-yellow-800">Awaiting</Badge>
                          )}
                          {booking.paymentStatus === 'paid' && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800">Completed</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={booking.status === 'completed'}
                          >
                            Manage
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsTab;
