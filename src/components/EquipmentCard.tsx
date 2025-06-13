
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export interface EquipmentProps {
  id: string;
  name: string;
  image: string;
  type: string;
  location: string;
  cluster: string;
  status: 'available' | 'in-use' | 'maintenance';
  pricePerUse: number;
  purchasePrice?: number;
  leaseRate?: number;
  nextAvailable?: string;
  onBook?: (id: string) => void;
}

const EquipmentCard: React.FC<EquipmentProps> = ({
  id,
  name,
  image,
  type,
  location,
  cluster,
  status,
  nextAvailable,
  onBook
}) => {
  const navigate = useNavigate();
  
  const statusColors = {
    'available': 'bg-red-500',
    'in-use': 'bg-black',
    'maintenance': 'bg-red-700'
  };

  const statusLabels = {
    'available': 'Available',
    'in-use': 'In Use',
    'maintenance': 'Maintenance'
  };
  
  const handleViewDetails = () => {
    navigate(`/equipment/${id}`);
  };

  return (
    <Card className="card-hover overflow-hidden border-gray-200">
      <div className="relative h-40 bg-gray-100">
        <img 
          src={image || "/placeholder.svg"} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
        <Badge 
          className={`absolute top-2 right-2 ${statusColors[status]}`}
        >
          {statusLabels[status]}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-red-600">{name}</CardTitle>
        <p className="text-sm text-gray-500">{type}</p>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location} ({cluster})</span>
        </div>
        {status === 'in-use' && nextAvailable && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Available: {nextAvailable}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EquipmentCard;
