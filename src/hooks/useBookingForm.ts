
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BookingFormProps {
  pricePerUse: number;
  onConfirm: (date: Date, duration: number, notes: string) => void;
  onClose: () => void;
}

interface BookingFormState {
  date: Date | undefined;
  timeSlot: string;
  duration: number;
  notes: string;
}

export function useBookingForm({ pricePerUse, onConfirm, onClose }: BookingFormProps) {
  const [formState, setFormState] = useState<BookingFormState>({
    date: new Date(),
    timeSlot: '09:00',
    duration: 1,
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleDateChange = (newDate: Date | undefined) => {
    setFormState(prev => ({ ...prev, date: newDate }));
  };

  const handleTimeSlotChange = (newTimeSlot: string) => {
    setFormState(prev => ({ ...prev, timeSlot: newTimeSlot }));
  };

  const handleDurationChange = (newDuration: string) => {
    setFormState(prev => ({ ...prev, duration: parseInt(newDuration) }));
  };

  const handleNotesChange = (newNotes: string) => {
    setFormState(prev => ({ ...prev, notes: newNotes }));
  };

  const calculateTotalPrice = () => {
    return pricePerUse * formState.duration;
  };

  const handleConfirm = (userId: string | undefined) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book equipment",
        variant: "destructive",
      });
      return;
    }
    
    if (!formState.date) {
      toast({
        title: "Date required",
        description: "Please select a date for your booking",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Create a new date with the selected time
    const bookingDate = new Date(formState.date);
    const [hours, minutes] = formState.timeSlot.split(':').map(Number);
    bookingDate.setHours(hours, minutes, 0, 0);
    
    try {
      onConfirm(bookingDate, formState.duration, formState.notes);
      // Reset form values
      setFormState({
        date: new Date(),
        timeSlot: '09:00',
        duration: 1,
        notes: '',
      });
    } catch (error) {
      console.error('Error during booking confirmation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formState,
    isSubmitting,
    handleDateChange,
    handleTimeSlotChange,
    handleDurationChange,
    handleNotesChange,
    handleConfirm,
    calculateTotalPrice
  };
}
