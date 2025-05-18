
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface EquipmentImageProps {
  imageUrl: string | null;
  name: string;
  category?: string | null;
  manufacturer?: string | null;
  condition?: string | null;
  location?: string | null;
  description?: string | null;
}

const EquipmentImage = ({ 
  imageUrl,
  name,
  category,
  manufacturer,
  condition,
  location,
  description
}: EquipmentImageProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 bg-gray-100 rounded-md overflow-hidden">
        <img 
          src={imageUrl || "/placeholder.svg"} 
          alt={name} 
          className="w-full h-64 object-cover object-center" 
        />
      </div>
      <div className="w-full md:w-2/3">
        <div className="flex items-center space-x-2 mb-4">
          {category && <Badge variant="outline" className="text-sm border-red-200 text-red-600">{category}</Badge>}
          {manufacturer && <Badge variant="outline" className="text-sm">{manufacturer}</Badge>}
          {condition && <Badge variant="outline" className="text-sm">{condition}</Badge>}
        </div>
        {location && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{location}</span>
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700">
            {description || 'No description available for this equipment.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EquipmentImage;
