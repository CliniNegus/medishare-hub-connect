
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import BookingLocationInfo from './booking/BookingLocationInfo';
import BookingDateTimeSection from './booking/BookingDateTimeSection';
import BookingDetailsSection from './booking/BookingDetailsSection';
import BookingPriceSummary from './booking/BookingPriceSummary';
import { useBookingForm } from '@/hooks/useBookingForm';

interface BookingModalProps {
  isOpen: boolean;
  equipmentName: string;
  pricePerUse: number;
  onClose: () => void;
  onConfirm: (date: Date, duration: number, notes: string) => void;
  location?: string;
  cluster?: string;
  availability?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  equipmentName,
  pricePerUse,
  onClose,
  onConfirm,
  location = "Not specified",
  cluster = "Not specified",
  availability = "Available now"
}) => {
  const { user } = useAuth();
  
  const {
    formState,
    isSubmitting,
    handleDateChange,
    handleTimeSlotChange,
    handleDurationChange,
    handleNotesChange,
    handleConfirm,
    calculateTotalPrice
  } = useBookingForm({ pricePerUse, onConfirm, onClose });
  
  const handleDialogClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };
  
  const totalPrice = calculateTotalPrice();
  
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book {equipmentName}</DialogTitle>
          <DialogDescription>
            Select date, time and duration for your booking
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Equipment Location Information */}
          <BookingLocationInfo 
            location={location}
            cluster={cluster}
            availability={availability}
          />
        
          <BookingDateTimeSection 
            date={formState.date}
            timeSlot={formState.timeSlot}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeSlotChange}
          />
          
          <BookingDetailsSection 
            duration={formState.duration}
            notes={formState.notes}
            onDurationChange={handleDurationChange}
            onNotesChange={handleNotesChange}
          />
          
          <BookingPriceSummary 
            pricePerUse={pricePerUse}
            duration={formState.duration}
            totalPrice={totalPrice}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button 
            onClick={() => handleConfirm(user?.id)}
            disabled={!formState.date || isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
