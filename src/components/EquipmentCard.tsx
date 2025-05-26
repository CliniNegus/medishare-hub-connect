
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, DollarSign, ShoppingCart, Clock, Calculator } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  pricePerUse,
  purchasePrice,
  leaseRate,
  nextAvailable,
  onBook
}) => {
  const navigate = useNavigate();
  
  const statusColors = {
    'available': 'bg-green-500',
    'in-use': 'bg-yellow-500',
    'maintenance': 'bg-red-500'
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
          className={`absolute top-2 right-2 ${statusColors[status]} text-white`}
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-2">
          <div className="flex flex-col text-xs">
            <span className="text-gray-500">Per Use:</span>
            <div className="flex items-center font-medium">
              <DollarSign className="h-3 w-3 mr-1 text-red-500" />
              <span>${pricePerUse.toFixed(2)}</span>
            </div>
          </div>
          
          {purchasePrice && (
            <div className="flex flex-col text-xs">
              <span className="text-gray-500">Purchase:</span>
              <div className="flex items-center font-medium">
                <ShoppingCart className="h-3 w-3 mr-1 text-red-500" />
                <span>${purchasePrice.toLocaleString()}</span>
              </div>
            </div>
          )}
          
          {leaseRate && (
            <div className="flex flex-col text-xs">
              <span className="text-gray-500">Lease/mo:</span>
              <div className="flex items-center font-medium">
                <Calculator className="h-3 w-3 mr-1 text-red-500" />
                <span>${leaseRate.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {status === 'available' ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Acquire Equipment
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onBook && onBook(id)} className="cursor-pointer">
                <Clock className="h-4 w-4 mr-2" />
                <span>Book for Use</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span>Purchase</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Calculator className="h-4 w-4 mr-2" />
                <span>Finance</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant="outline" 
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EquipmentCard;
