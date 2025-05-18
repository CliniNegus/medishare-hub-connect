
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EquipmentDetails } from '@/types/equipment';
import { Booking } from '@/types/booking';

type BookingFunction = (date: Date, duration: number, notes: string) => Promise<void>;

export function useEquipmentBooking(
  equipmentId: string | undefined,
  equipment: EquipmentDetails | null,
  userId: string | undefined,
  onSuccess: () => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleBooking: BookingFunction = async (date, duration, notes) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book equipment",
        variant: "destructive",
      });
      return;
    }

    if (!equipment || !equipmentId) return;

    try {
      setIsSubmitting(true);
      
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
        price_paid: equipment ? (equipment.price / 100) * duration : 0
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(booking)
        .select()
        .single();

      if (error) throw error;

      // Temporary update equipment status
      await supabase
        .from('equipment')
        .update({ status: 'in-use' })
        .eq('id', equipmentId);

      toast({
        title: "Booking successful",
        description: `You have booked ${equipment?.name} for ${duration} hour(s)`,
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleBooking,
    isSubmitting
  };
}
