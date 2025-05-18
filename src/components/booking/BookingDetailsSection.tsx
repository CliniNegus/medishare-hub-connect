
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BookingDetailsSectionProps {
  duration: number;
  notes: string;
  onDurationChange: (duration: string) => void;
  onNotesChange: (notes: string) => void;
}

const BookingDetailsSection: React.FC<BookingDetailsSectionProps> = ({
  duration,
  notes,
  onDurationChange,
  onNotesChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="duration">Duration (hours)</Label>
        <Select 
          value={duration.toString()} 
          onValueChange={onDurationChange}
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
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
    </>
  );
};

export default BookingDetailsSection;
