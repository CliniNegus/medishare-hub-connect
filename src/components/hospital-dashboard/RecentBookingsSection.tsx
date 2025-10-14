
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
      <Card className="border-[#E02020]/20 w-full max-w-full">
        <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20 p-4 sm:p-6">
          <CardTitle className="text-[#333333] flex items-center text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#E02020] flex-shrink-0" />
            <span>Recent Bookings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 w-full max-w-full box-border">
          <div className="space-y-3 sm:space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm animate-pulse w-full">
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
    <Card className="border-[#E02020]/20 w-full max-w-full">
      <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20 p-4 sm:p-6">
        <CardTitle className="text-[#333333] flex items-center text-base sm:text-lg">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#E02020] flex-shrink-0" />
          <span>Recent Bookings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 w-full max-w-full box-border">
        {bookings.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <Calendar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
            <p className="text-sm sm:text-base">No recent bookings found</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm hover:shadow-md transition-shadow w-full">
                <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#333333] text-sm sm:text-base truncate">{booking.equipment?.name || 'Unknown Equipment'}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{booking.equipment?.location || 'Location not specified'}</span>
                    </p>
                  </div>
                  <Badge className={`capitalize text-xs whitespace-nowrap flex-shrink-0 ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center text-gray-600 min-w-0">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">{new Date(booking.start_time).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600 min-w-0">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">${booking.price_paid?.toLocaleString() || '0'}</span>
                  </div>
                </div>
                
                {booking.notes && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">Notes:</span> <span className="break-words">{booking.notes}</span>
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
