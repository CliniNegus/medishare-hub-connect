
import React from 'react';
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock } from "lucide-react";

interface BookingDateTimeSectionProps {
  date: Date | undefined;
  timeSlot: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

const BookingDateTimeSection: React.FC<BookingDateTimeSectionProps> = ({
  date,
  timeSlot,
  onDateChange,
  onTimeChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="booking-date">Booking Date</Label>
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            disabled={(date) => date < new Date() || new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)}
            className="rounded-md border"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="booking-time">Time Slot</Label>
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 opacity-70" />
          <Select 
            value={timeSlot} 
            onValueChange={onTimeChange}
          >
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
    </>
  );
};

export default BookingDateTimeSection;
