
import React from 'react';
import { Calendar } from "lucide-react";

const BookingsTab: React.FC = () => {
  return (
    <div className="h-64 flex items-center justify-center text-gray-500">
      <div className="text-center">
        <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
        <h3 className="text-lg font-medium mb-1">Booking Management</h3>
        <p className="text-sm">You can manage your equipment bookings here.</p>
      </div>
    </div>
  );
};

export default BookingsTab;
