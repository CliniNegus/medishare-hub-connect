
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, Clock, MapPin, DollarSign } from "lucide-react";
import { useRealTimeBookings } from '@/hooks/use-real-time-bookings';

const RecentBookingsSection: React.FC = () => {
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

  if (loading) {
    return (
      <Card className="border-[#E02020]/20">
        <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20">
          <CardTitle className="text-[#333333] flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-[#E02020]" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#E02020]/20">
      <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20">
        <CardTitle className="text-[#333333] flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-[#E02020]" />
          Recent Bookings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No recent bookings found</p>
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
                  <Badge className={`capitalize ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {new Date(booking.start_time).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    ${booking.price_paid?.toLocaleString() || '0'}
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
  );
};

export default RecentBookingsSection;
