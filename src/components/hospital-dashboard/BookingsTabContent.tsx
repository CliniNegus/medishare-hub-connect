
import React from 'react';
import { EquipmentProps } from '../EquipmentCard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Star } from "lucide-react";

interface BookingsTabContentProps {
  equipmentData: EquipmentProps[];
  onBookEquipment: (id: string) => void;
}

const BookingsTabContent: React.FC<BookingsTabContentProps> = ({
  equipmentData,
  onBookEquipment
}) => {
  const mockBookings = [
    {
      id: '1',
      equipmentName: 'MRI Scanner Pro',
      date: '2024-01-15',
      time: '10:00 AM - 12:00 PM',
      status: 'confirmed',
      location: 'Radiology Department',
      patient: 'John Doe'
    },
    {
      id: '2',
      equipmentName: 'Ultrasound System',
      date: '2024-01-16',
      time: '2:00 PM - 3:30 PM',
      status: 'pending',
      location: 'Emergency Ward',
      patient: 'Jane Smith'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#E02020]">Equipment Bookings</h2>
          <p className="text-gray-600">Manage your equipment reservations and upcoming appointments</p>
        </div>
        <Button className="bg-[#E02020] hover:bg-[#c01c1c] text-white">
          <Calendar className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Current Bookings */}
          <Card className="border-[#E02020]/20">
            <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20">
              <CardTitle className="text-[#333333] flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-[#E02020]" />
                Current Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {mockBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-[#333333]">{booking.equipmentName}</h3>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.location}
                        </p>
                      </div>
                      <Badge 
                        variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                        className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {booking.date}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {booking.time}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        Patient: {booking.patient}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white">
                          Modify
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Equipment for Booking */}
          <Card className="border-[#E02020]/20">
            <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20">
              <CardTitle className="text-[#333333]">Available Equipment for Booking</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipmentData.slice(0, 4).map(equipment => (
                  <div key={equipment.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-[#333333]">{equipment.name}</h3>
                        <p className="text-sm text-[#E02020] font-medium">${equipment.pricePerUse} per use</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.8</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Location:</span> {equipment.location || 'Central Warehouse'}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        Available
                      </Badge>
                      <Button 
                        size="sm" 
                        onClick={() => onBookEquipment(equipment.id)}
                        className="bg-[#E02020] hover:bg-[#c01c1c] text-white"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Hospital Cluster Information */}
          <Card className="border-[#E02020]/20">
            <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20">
              <CardTitle className="text-[#333333] text-lg">Hospital Network</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#333333] mb-2">Your Cluster:</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">Northwest Medical Network</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#333333] mb-2">Network Hospitals:</h4>
                  <div className="space-y-2">
                    {[
                      'City General Hospital',
                      'Memorial Medical Center', 
                      'University Health System',
                      'County Hospital'
                    ].map((hospital, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        <div className="w-2 h-2 bg-[#E02020] rounded-full mr-2"></div>
                        {hospital}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-[#E02020]/20">
            <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20">
              <CardTitle className="text-[#333333] text-lg">Booking Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-semibold text-[#333333]">24 bookings</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Utilization Rate</span>
                  <span className="font-semibold text-green-600">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cost Savings</span>
                  <span className="font-semibold text-[#E02020]">$12,450</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingsTabContent;
