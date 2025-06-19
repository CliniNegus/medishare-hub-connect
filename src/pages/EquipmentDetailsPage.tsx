import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, DollarSign, ShoppingCart, Clock, Calculator, ArrowLeft, Package, Wrench } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import BookingModal from '@/components/BookingModal';
import PurchaseModal from '@/components/PurchaseModal';
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
  model: string;
  serial_number: string;
  specs: string;
  quantity: number;
  usage_hours: number;
  downtime_hours: number;
}

const EquipmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<EquipmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

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

  const handlePurchase = async (paymentMethod: string, shippingAddress: string, notes: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase equipment",
        variant: "destructive",
      });
      return;
    }

    if (!equipment) return;

    // The actual payment and order creation is now handled by the PaystackPaymentButton
    // This function is called after successful payment initiation
    console.log('Purchase initiated for:', {
      equipment: equipment.name,
      amount: equipment.price,
      paymentMethod,
      shippingAddress,
      notes
    });

    toast({
      title: "Purchase initiated",
      description: "Your purchase is being processed. You will be redirected to complete payment.",
    });
    
    setPurchaseModalOpen(false);
  };

  const createBooking = async (date: Date, duration: number, notes: string) => {
    try {
      const endDate = new Date(date);
      endDate.setHours(endDate.getHours() + duration);

      const booking = {
        equipment_id: id,
        user_id: user?.id,
        start_time: date.toISOString(),
        end_time: endDate.toISOString(),
        status: 'pending',
        notes: notes,
        price_paid: equipment ? (equipment.price / 100) * duration : 0
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(booking)
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('equipment')
        .update({ status: 'in-use' })
        .eq('id', id);

      toast({
        title: "Booking successful",
        description: `You have booked ${equipment?.name} for ${duration} hour(s)`,
      });
      
      setBookingModalOpen(false);

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

  const handleFinancing = () => {
    toast({
      title: "Financing Options",
      description: "Financing options will be available soon. Please contact our sales team for more information.",
    });
  };

  const statusColors = {
    'Available': 'bg-green-500',
    'In Use': 'bg-black',
    'Maintenance': 'bg-red-700',
    'available': 'bg-green-500',
    'in-use': 'bg-black',
    'maintenance': 'bg-red-700',
    'sold': 'bg-blue-500'
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
  const isSold = status === 'sold';
  const isAvailable = status === 'Available' || status === 'available';

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
              <CardTitle className="text-3xl font-bold text-red-600">{equipment?.name}</CardTitle>
              <Badge className={`${statusColors[status]} text-white`}>
                {status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2 bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={equipment?.image_url || "/placeholder.svg"} 
                    alt={equipment?.name} 
                    className="w-full h-96 object-cover object-center" 
                  />
                </div>
                <div className="w-full lg:w-1/2">
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <Badge variant="outline" className="text-sm border-red-200 text-red-600">{equipment?.category}</Badge>
                    <Badge variant="outline" className="text-sm">{equipment?.manufacturer}</Badge>
                    {equipment?.condition && <Badge variant="outline" className="text-sm">{equipment?.condition}</Badge>}
                    {equipment?.model && <Badge variant="outline" className="text-sm">Model: {equipment?.model}</Badge>}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="text-lg">{equipment?.location || 'Location not specified'}</span>
                    </div>
                    
                    {equipment?.serial_number && (
                      <div className="flex items-center text-gray-600">
                        <Package className="h-5 w-5 mr-2" />
                        <span>Serial: {equipment.serial_number}</span>
                      </div>
                    )}
                    
                    {(equipment?.usage_hours || equipment?.downtime_hours) && (
                      <div className="flex items-center text-gray-600">
                        <Wrench className="h-5 w-5 mr-2" />
                        <span>
                          Usage: {equipment?.usage_hours || 0}h | Downtime: {equipment?.downtime_hours || 0}h
                        </span>
                      </div>
                    )}
                    
                    {equipment?.quantity && equipment.quantity > 1 && (
                      <div className="text-gray-600">
                        <span className="font-medium">Available Quantity: {equipment.quantity}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {equipment?.description || 'No description available for this equipment.'}
                    </p>
                  </div>
                  
                  {equipment?.specs && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">Technical Specifications</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {equipment.specs}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-2">Purchase Price</span>
                      <div className="flex items-center">
                        <DollarSign className="h-6 w-6 mr-2 text-red-500" />
                        <span className="text-2xl font-bold text-gray-800">KES {equipment?.price?.toLocaleString() || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-2">Monthly Lease Rate</span>
                      <div className="flex items-center">
                        <Calculator className="h-6 w-6 mr-2 text-red-500" />
                        <span className="text-2xl font-bold text-gray-800">KES {equipment?.lease_rate?.toLocaleString() || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-2">Per Use Price</span>
                      <div className="flex items-center">
                        <Clock className="h-6 w-6 mr-2 text-red-500" />
                        <span className="text-2xl font-bold text-gray-800">KES {perUsePrice?.toFixed(2) || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="bg-white p-6 rounded-lg border-2 border-red-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Equipment Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {!isSold && isAvailable ? (
                    <>
                      <Button 
                        size="lg"
                        className="bg-[#E02020] hover:bg-[#c01010] text-white py-4 text-lg font-semibold shadow-md transform transition hover:scale-105"
                        onClick={() => setBookingModalOpen(true)}
                      >
                        <Clock className="h-5 w-5 mr-2" />
                        Book for Use
                      </Button>
                      
                      <Button 
                        size="lg"
                        variant="outline" 
                        className="border-2 border-[#E02020] text-[#E02020] hover:bg-red-50 py-4 text-lg font-semibold"
                        onClick={() => setPurchaseModalOpen(true)}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Purchase
                      </Button>
                      
                      <Button 
                        size="lg"
                        variant="outline" 
                        className="border-2 border-[#333333] text-[#333333] hover:bg-gray-50 py-4 text-lg font-semibold"
                        onClick={handleFinancing}
                      >
                        <Calculator className="h-5 w-5 mr-2" />
                        Financing
                      </Button>
                    </>
                  ) : (
                    <div className="col-span-3 text-center">
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-red-200 text-red-600 hover:bg-red-50 py-4 text-lg"
                        disabled
                      >
                        <Clock className="h-5 w-5 mr-2" />
                        {isSold ? "Equipment Sold" : "Currently Unavailable"}
                      </Button>
                    </div>
                  )}
                </div>
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
        availability={isAvailable ? 'Available now' : 'Currently unavailable'}
      />

      <PurchaseModal
        isOpen={purchaseModalOpen}
        equipmentName={equipment?.name || ''}
        equipmentPrice={equipment?.price || 0}
        equipmentId={id || ''}
        onClose={() => setPurchaseModalOpen(false)}
        onConfirm={handlePurchase}
        location={equipment?.location}
        manufacturer={equipment?.manufacturer}
      />
    </div>
  );
};

export default EquipmentDetailsPage;
