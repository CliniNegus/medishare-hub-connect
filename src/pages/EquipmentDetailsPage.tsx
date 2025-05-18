
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BookingModal from '@/components/BookingModal';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useEquipmentDetails } from '@/hooks/useEquipmentDetails';
import { useEquipmentBooking } from '@/hooks/useEquipmentBooking';
import EquipmentHeader from '@/components/equipment/EquipmentHeader';
import EquipmentImage from '@/components/equipment/EquipmentImage';
import EquipmentPricing from '@/components/equipment/EquipmentPricing';
import EquipmentActions from '@/components/equipment/EquipmentActions';
import EquipmentLoading from '@/components/equipment/EquipmentLoading';
import EquipmentNotFound from '@/components/equipment/EquipmentNotFound';

const EquipmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const { equipment, loading, refreshEquipment } = useEquipmentDetails(id);
  const { handleBooking, isSubmitting } = useEquipmentBooking(
    id, 
    equipment, 
    user?.id, 
    () => {
      setBookingModalOpen(false);
      refreshEquipment();
    }
  );

  const handleBack = () => {
    navigate(-1);
  };

  const isAvailable = equipment?.status === 'Available' || equipment?.status === 'available';
  const perUsePrice = equipment ? Math.round(equipment.price / 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <EquipmentLoading onBack={handleBack} />
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <EquipmentNotFound onBack={handleBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <EquipmentHeader 
              equipment={equipment} 
              onBack={handleBack} 
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <EquipmentImage 
                imageUrl={equipment.image_url}
                name={equipment.name}
                category={equipment.category}
                manufacturer={equipment.manufacturer}
                condition={equipment.condition}
                location={equipment.location}
                description={equipment.description}
              />
              
              <Separator />

              <EquipmentPricing 
                price={equipment.price}
                leaseRate={equipment.lease_rate}
                perUsePrice={perUsePrice}
              />

              <Separator />

              <EquipmentActions 
                isAvailable={isAvailable} 
                onBook={() => setBookingModalOpen(true)} 
              />
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
    </div>
  );
};

export default EquipmentDetailsPage;
