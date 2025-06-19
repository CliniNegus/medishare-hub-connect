import React, { useState } from 'react';
import { EquipmentProps } from '../EquipmentCard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Star } from "lucide-react";
import { useRealTimeBookings } from '@/hooks/use-real-time-bookings';
import { useEquipmentData } from '@/hooks/use-equipment-data';
import BookingModal from '../BookingModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BookingsTabContentProps {
  equipmentData: EquipmentProps[];
  onBookEquipment: (id: string) => void;
}

const BookingsTabContent: React.FC<BookingsTabContentProps> = ({
  equipmentData: staticEquipmentData,
  onBookEquipment
}) => {
  const { bookings, loading } = useRealTimeBookings();
  const { equipment, loading: equipmentLoading } = useEquipmentData();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Transform equipment data from Supabase to match EquipmentProps interface
  const transformedEquipment = equipment.slice(0, 4).map(item => ({
    id: item.id,
    name: item.name,
    image: item.image_url || '/placeholder.svg',
    type: item.category || 'Medical Equipment',
    location: item.location || 'Central Warehouse',
    cluster: item.cluster || 'Main Hospital',
    status: item.type,
    pricePerUse: item.pricePerUse || 50,
    purchasePrice: item.purchasePrice,
    leaseRate: item.leaseRate,
    nextAvailable: item.nextAvailable
  }));

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

  const handleBookEquipment = (equipmentId: string) => {
    const equipment = transformedEquipment.find(eq => eq.id === equipmentId);
    if (equipment) {
      setSelectedEquipment(equipment);
      setBookingModalOpen(true);
    }
  };

  const handleNewBooking = () => {
    // Open modal with first available equipment or let user select
    if (transformedEquipment.length > 0) {
      setSelectedEquipment(transformedEquipment[0]);
      setBookingModalOpen(true);
    } else {
      toast({
        title: "No Equipment Available",
        description: "There is no equipment available for booking at the moment.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmBooking = async (date: Date, duration: number, notes: string) => {
    if (!user || !selectedEquipment) {
      toast({
        title: "Error",
        description: "Please ensure you're logged in and have selected equipment.",
        variant: "destructive",
      });
      return;
    }

    try {
      const startTime = date.toISOString();
      const endTime = new Date(date.getTime() + (duration * 60 * 60 * 1000)).toISOString();
      const totalPrice = selectedEquipment.pricePerUse * duration;

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            equipment_id: selectedEquipment.id,
            user_id: user.id,
            start_time: startTime,
            end_time: endTime,
            status: 'pending',
            notes: notes,
            price_paid: totalPrice
          }
        ]);

      if (error) throw error;

      toast({
        title: "Booking Confirmed",
        description: `Successfully booked ${selectedEquipment.name} for ${duration} hour${duration > 1 ? 's' : ''}.`,
      });

      setBookingModalOpen(false);
      setSelectedEquipment(null);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#E02020]">Equipment Bookings</h2>
          <p className="text-gray-600">Manage your equipment reservations and upcoming appointments</p>
        </div>
        <Button 
          className="bg-[#E02020] hover:bg-[#c01c1c] text-white"
          onClick={handleNewBooking}
        >
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
                          Cost: Ksh {booking.price_paid?.toLocaleString() || '0'}
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

          {/* Available Equipment for Booking - Now using real data */}
          <Card className="border-[#E02020]/20">
            <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20">
              <CardTitle className="text-[#333333]">Available Equipment for Booking</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {equipmentLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white shadow-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : transformedEquipment.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No equipment available for booking</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {transformedEquipment.map(equipment => (
                    <div key={equipment.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-[#333333]">{equipment.name}</h3>
                          <p className="text-sm text-[#E02020] font-medium">Ksh {equipment.pricePerUse} per use</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">4.8</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Location:</span> {equipment.location}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          {equipment.status === 'available' ? 'Available' : 'In Use'}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => handleBookEquipment(equipment.id)}
                          className="bg-[#E02020] hover:bg-[#c01c1c] text-white"
                          disabled={equipment.status !== 'available'}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                    Ksh {bookings.reduce((sum, booking) => sum + (booking.price_paid || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedEquipment && (
        <BookingModal 
          isOpen={bookingModalOpen}
          equipmentId={selectedEquipment.id}
          equipmentName={selectedEquipment.name}
          pricePerUse={selectedEquipment.pricePerUse}
          location={selectedEquipment.location}
          cluster={selectedEquipment.cluster}
          availability={selectedEquipment.status === 'available' ? 'Available now' : selectedEquipment.nextAvailable || 'Not available'}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedEquipment(null);
          }}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default BookingsTabContent;
