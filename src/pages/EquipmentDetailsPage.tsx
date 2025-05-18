import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, DollarSign, ShoppingCart, Clock, Calculator, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import BookingModal from '@/components/BookingModal';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

interface EquipmentDetails {
  id: string;
  name: string;
  image_url: string;
  description: string;
  price: number;
  category: string;
  manufacturer: string;
  status: string;
  location: string;
  lease_rate: number;
  condition: string;
  created_at: string;
  updated_at: string;
}

const EquipmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [equipment, setEquipment] = useState<EquipmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('equipment')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setEquipment(data as EquipmentDetails);
      } catch (error: any) {
        console.error('Error fetching equipment details:', error.message);
        toast({
          title: "Failed to load equipment details",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchEquipmentDetails();
    }
  }, [id, toast]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleBooking = (date: Date, duration: number, notes: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book equipment",
        variant: "destructive",
      });
      return;
    }

    if (!equipment) return;

    createBooking(date, duration, notes);
  };

  const createBooking = async (date: Date, duration: number, notes: string) => {
    try {
      // Calculate end time based on duration (in hours)
      const endDate = new Date(date);
      endDate.setHours(endDate.getHours() + duration);

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          equipment_id: id,
          user_id: user?.id,
          start_time: date.toISOString(),
          end_time: endDate.toISOString(),
          status: 'pending',
          notes: notes,
          price_paid: equipment ? (equipment.price / 100) * duration : 0
        })
        .select()
        .single();

      if (error) throw error;

      // Temporary update equipment status
      await supabase
        .from('equipment')
        .update({ status: 'in-use' })
        .eq('id', id);

      toast({
        title: "Booking successful",
        description: `You have booked ${equipment?.name} for ${duration} hour(s)`,
      });

      // Refresh equipment data
      const { data: updatedEquipment, error: equipmentError } = await supabase
        .from('equipment')
        .select('*')
        .eq('id', id)
        .single();
        
      if (!equipmentError) {
        setEquipment(updatedEquipment as EquipmentDetails);
      }

    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const statusColors = {
    'Available': 'bg-green-500',
    'In Use': 'bg-black',
    'Maintenance': 'bg-red-700',
    'available': 'bg-green-500',
    'in-use': 'bg-black',
    'maintenance': 'bg-red-700'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" className="mb-6" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="h-64 w-full md:w-1/3" />
                  <div className="w-full md:w-2/3 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" className="mb-6" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-700">Equipment Not Found</h2>
                <p className="mt-2 text-gray-500">The equipment you're looking for doesn't exist or has been removed.</p>
                <Button className="mt-6 bg-red-600 hover:bg-red-700" onClick={handleBack}>
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const status = equipment?.status || 'Available';
  const perUsePrice = equipment ? Math.round(equipment.price / 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-red-600">{equipment?.name}</CardTitle>
              <Badge className={`${statusColors[status]}`}>
                {status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={equipment?.image_url || "/placeholder.svg"} 
                    alt={equipment?.name} 
                    className="w-full h-64 object-cover object-center" 
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="outline" className="text-sm border-red-200 text-red-600">{equipment?.category}</Badge>
                    <Badge variant="outline" className="text-sm">{equipment?.manufacturer}</Badge>
                    <Badge variant="outline" className="text-sm">{equipment?.condition}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{equipment?.location || 'Location not specified'}</span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">
                      {equipment?.description || 'No description available for this equipment.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1">Purchase Price</span>
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-1 text-red-500" />
                        <span className="text-xl font-bold">${equipment?.price?.toLocaleString() || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1">Monthly Lease Rate</span>
                      <div className="flex items-center">
                        <Calculator className="h-5 w-5 mr-1 text-red-500" />
                        <span className="text-xl font-bold">${equipment?.lease_rate?.toLocaleString() || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1">Per Use Price</span>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-1 text-red-500" />
                        <span className="text-xl font-bold">${perUsePrice?.toFixed(2) || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                {status === 'Available' || status === 'available' ? (
                  <>
                    <Button 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => setBookingModalOpen(true)}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Book for Use
                    </Button>
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Purchase
                    </Button>
                    <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                      <Calculator className="h-4 w-4 mr-2" />
                      Finance
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    <Clock className="h-4 w-4 mr-2" />
                    Check Availability
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BookingModal
        isOpen={bookingModalOpen}
        equipmentName={equipment?.name || ''}
        pricePerUse={perUsePrice}
        onClose={() => setBookingModalOpen(false)}
        onConfirm={handleBooking}
        location={equipment?.location}
        cluster="Main Hospital"
        availability={status === 'Available' || status === 'available' ? 'Available now' : 'Currently unavailable'}
      />
    </div>
  );
};

export default EquipmentDetailsPage;
