
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState<number>(1);
  const [notes, setNotes] = useState("");
  
  const handleConfirm = () => {
    if (date) {
      onConfirm(date, duration, notes);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book {equipmentName}</DialogTitle>
          <DialogDescription>
            Select date, time and duration for your booking
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Equipment Location Information */}
          <div className="rounded-md bg-gray-50 p-3 border border-gray-200">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-red-500" />
              <div>
                <h4 className="font-medium text-sm">Equipment Location</h4>
                <p className="text-xs text-gray-600">Located at <span className="font-medium">{location}</span></p>
                <p className="text-xs text-gray-600">Part of <Badge variant="outline" className="text-xs">{cluster}</Badge> cluster</p>
                <p className="text-xs mt-1">
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-100">{availability}</Badge>
                </p>
              </div>
            </div>
          </div>
        
          <div className="space-y-2">
            <Label htmlFor="booking-date">Booking Date</Label>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="booking-time">Time Slot</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 opacity-70" />
              <Select onValueChange={(value) => console.log(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="13:00">01:00 PM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                  <SelectItem value="15:00">03:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (hours)</Label>
            <Select 
              defaultValue="1" 
              onValueChange={(value) => setDuration(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="8">8 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Add any special requirements"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Price per hour:</span>
              <span>${pricePerUse.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Duration:</span>
              <span>{duration} hour{duration > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between font-medium text-base mt-2 pt-2 border-t">
              <span>Total:</span>
              <span>${(pricePerUse * duration).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!date}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
