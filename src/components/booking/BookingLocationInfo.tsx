
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface BookingLocationInfoProps {
  location: string;
  cluster: string;
  availability: string;
}

const BookingLocationInfo: React.FC<BookingLocationInfoProps> = ({ 
  location, 
  cluster, 
  availability 
}) => {
  const availabilityColor = availability.toLowerCase().includes('available') 
    ? "bg-green-100 text-green-800" 
    : "bg-gray-100 text-gray-800";
  
  return (
    <div className="rounded-md bg-gray-50 p-3 border border-gray-200">
      <div className="flex items-start gap-2">
        <MapPin className="h-4 w-4 mt-0.5 text-red-500" />
        <div>
          <h4 className="font-medium text-sm">Equipment Location</h4>
          <p className="text-xs text-gray-600">Located at <span className="font-medium">{location}</span></p>
          <p className="text-xs text-gray-600">Part of <Badge variant="outline" className="text-xs">{cluster}</Badge> cluster</p>
          <p className="text-xs mt-1">
            <Badge variant="secondary" className={`text-xs ${availabilityColor} hover:${availabilityColor}`}>{availability}</Badge>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingLocationInfo;
