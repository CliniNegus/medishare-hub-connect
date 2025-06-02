
import React from 'react';
import { EquipmentProps } from '../EquipmentCard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Star } from "lucide-react";
import { useRealTimeBookings } from '@/hooks/use-real-time-bookings';

interface BookingsTabContentProps {
  equipmentData: EquipmentProps[];
  onBookEquipment: (id: string) => void;
}

const BookingsTabContent: React.FC<BookingsTabContentProps> = ({
  equipmentData,
  onBookEquipment
}) => {
  const { bookings, loading } = useRealTimeBookings();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (startTime: string, endTime: string) => {
    try {
      const start = new Date(startTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      const end = new Date(endTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `${start} - ${end}`;
    } catch (error) {
      return 'Invalid time';
    }
  };

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
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white shadow-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No current bookings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-[#333333]">{booking.equipment?.name || 'Unknown Equipment'}</h3>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {booking.equipment?.location || 'Location not specified'}
                          </p>
                        </div>
                        <Badge 
                          className={`capitalize ${getStatusColor(booking.status)}`}
                        >
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(booking.start_time)}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {formatTime(booking.start_time, booking.end_time)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          Cost: ${booking.price_paid?.toLocaleString() || '0'}
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
                      
                      {booking.notes && (
                        <div className="mt-3 text-sm text-gray-600">
                          <span className="font-medium">Notes:</span> {booking.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                  <span className="font-semibold text-[#333333]">{bookings.length} bookings</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Bookings</span>
                  <span className="font-semibold text-green-600">{bookings.filter(b => b.status === 'confirmed' || b.status === 'in_progress').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Spent</span>
                  <span className="font-semibold text-[#E02020]">
                    ${bookings.reduce((sum, booking) => sum + (booking.price_paid || 0), 0).toLocaleString()}
                  </span>
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
