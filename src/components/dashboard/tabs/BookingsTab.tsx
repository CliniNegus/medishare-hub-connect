
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BookingsTab: React.FC = () => {
  // Mock data for bookings
  const upcomingBookings = [
    { id: 1, equipment: "MRI Scanner", date: "2025-04-22", time: "09:00 AM", duration: 2, requestedBy: "Dr. Smith" },
    { id: 2, equipment: "CT Scanner", date: "2025-04-23", time: "11:30 AM", duration: 1, requestedBy: "Dr. Johnson" },
    { id: 3, equipment: "Ultrasound Machine", date: "2025-04-24", time: "02:00 PM", duration: 1.5, requestedBy: "Dr. Williams" }
  ];

  // Mock data for multi-user access
  const userAccess = [
    { name: "Dr. Sarah Smith", role: "Physician", accessLevel: "Full" },
    { name: "John Richards", role: "Biomedical Technician", accessLevel: "Maintenance" },
    { name: "Lisa Johnson", role: "Administrator", accessLevel: "Booking" },
    { name: "Mark Williams", role: "Department Head", accessLevel: "Full" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Equipment Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingBookings.map(booking => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.equipment}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>{booking.duration} hr{booking.duration !== 1 ? 's' : ''}</TableCell>
                    <TableCell>{booking.requestedBy}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                          <FileText className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          <Clock className="h-3 w-3 mr-1" />
                          Reschedule
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
              <Button className="bg-red-600 hover:bg-red-700">
                Book New Equipment
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Users className="h-5 w-5 mr-2" />
              Multi-User Access Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">
              Configure access levels and permissions for various staff members who need to interact with medical equipment.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAccess.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.accessLevel === 'Full' ? 'bg-green-100 text-green-800' : 
                        user.accessLevel === 'Maintenance' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.accessLevel}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                        Modify Access
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
              <Button className="bg-red-600 hover:bg-red-700">
                Add New User
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-red-600 hover:bg-red-700">
              <Calendar className="h-4 w-4 mr-2" />
              Book Equipment
            </Button>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              <Clock className="h-4 w-4 mr-2" />
              View Schedule
            </Button>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-100">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-red-600">Hospital Cluster Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium">Your Cluster:</h4>
                <p className="text-sm">Northwest Medical Network</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Member Hospitals:</h4>
                <ul className="text-sm list-disc list-inside">
                  <li>City General Hospital</li>
                  <li>Memorial Medical Center</li>
                  <li>University Health System</li>
                  <li>County Hospital</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium">Shared Equipment Available:</h4>
                <p className="text-sm">24 units across your cluster</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingsTab;
