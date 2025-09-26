import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, MapPin } from 'lucide-react';
import { usePopularEquipment } from '@/hooks/usePopularEquipment';
import { Skeleton } from "@/components/ui/skeleton";

interface PopularEquipmentSectionProps {
  onBookEquipment?: (id: string) => void;
}

const PopularEquipmentSection: React.FC<PopularEquipmentSectionProps> = ({ 
  onBookEquipment 
}) => {
  const { equipment, loading, error } = usePopularEquipment(5);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Most Popular Equipment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Most Popular Equipment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Unable to load popular equipment. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (equipment.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Most Popular Equipment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No equipment available at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Most Popular Equipment
          <Badge variant="secondary" className="ml-auto">
            Top {equipment.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {equipment.map((item, index) => (
            <Card key={item.id} className="relative overflow-hidden">
              {item.is_featured && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-[#E02020] text-white">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                </div>
              )}
              
              {index < 3 && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge variant="outline" className="bg-white/90">
                    #{index + 1}
                  </Badge>
                </div>
              )}

              <div className="aspect-video bg-gray-100 relative">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{item.manufacturer}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  <Badge 
                    variant={item.status === 'Available' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {item.status}
                  </Badge>
                </div>

                {item.location && (
                  <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>Bookings: {item.booking_count}</span>
                  <span>Score: {item.popularity_score}</span>
                </div>

                {onBookEquipment && item.status === 'Available' && (
                  <Button 
                    size="sm" 
                    className="w-full" 
                    onClick={() => onBookEquipment(item.id)}
                  >
                    Book Now
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          Showing the most popular equipment based on bookings and usage
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularEquipmentSection;