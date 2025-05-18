
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EquipmentDetails } from '@/types/equipment';

interface BookingParams {
  equipmentId: string;
  userId: string;
  date: Date;
  duration: number;
  notes: string;
  price: number;
}

interface UseEquipmentBookingProps {
  equipment: EquipmentDetails | null;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useEquipmentBooking({
  equipment,
  onSuccess,
  onError
}: UseEquipmentBookingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleBooking = async (
    date: Date,
    duration: number,
    notes: string,
    userId?: string
  ) => {
    if (!userId) {
      const error = new Error("Authentication required to book equipment");
      toast({
        title: "Authentication required",
        description: "Please sign in to book equipment",
        variant: "destructive",
      });
      
      if (onError) onError(error);
      return;
    }

    if (!equipment || !equipment.id) {
      const error = new Error("Equipment details not available");
      toast({
        title: "Booking failed",
        description: "Equipment details not available",
        variant: "destructive",
      });
      
      if (onError) onError(error);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Calculate end time based on duration (in hours)
      const endDate = new Date(date);
      endDate.setHours(endDate.getHours() + duration);

      const bookingPrice = equipment ? (equipment.price / 100) * duration : 0;

      const bookingData: BookingParams = {
        equipmentId: equipment.id,
        userId: userId,
        date,
        duration,
        notes,
        price: bookingPrice
      };

      await createBooking(bookingData);
      
      toast({
        title: "Booking successful",
        description: `You have booked ${equipment.name} for ${duration} hour(s)`,
      });
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error creating booking:', error);
      
      toast({
        title: "Booking failed",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
      
      if (onError) onError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createBooking = async ({
    equipmentId,
    userId,
    date,
    duration,
    notes,
    price
  }: BookingParams) => {
    // Calculate end time based on duration (in hours)
    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + duration);
    
    const booking = {
      equipment_id: equipmentId,
      user_id: userId,
      start_time: date.toISOString(),
      end_time: endDate.toISOString(),
      status: 'pending',
      notes: notes,
      price_paid: price
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) throw error;

    // Update equipment status
    await updateEquipmentStatus(equipmentId, 'in-use');

    return data;
  };

  const updateEquipmentStatus = async (equipmentId: string, status: string) => {
    const { error } = await supabase
      .from('equipment')
      .update({ status })
      .eq('id', equipmentId);

    if (error) throw error;
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .select()
        .single();
        
      if (error) throw error;
      
      if (data && data.equipment_id) {
        await updateEquipmentStatus(data.equipment_id, 'available');
      }
      
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled",
      });
      
      if (onSuccess) onSuccess();
      return data;
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Failed to cancel booking",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
      
      if (onError) onError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleBooking,
    cancelBooking,
    isSubmitting
  };
}
