
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
import { CalendarIcon, Clock, MapPin, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<string>('09:00');
  const [duration, setDuration] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("date-time");
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleConfirm = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book equipment",
        variant: "destructive",
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a date for your booking",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Create a new date with the selected time
    const bookingDate = new Date(date);
    const [hours, minutes] = timeSlot.split(':').map(Number);
    bookingDate.setHours(hours, minutes, 0, 0);
    
    try {
      onConfirm(bookingDate, duration, notes);
      // Reset form values
      setDate(new Date());
      setTimeSlot('09:00');
      setDuration(1);
      setNotes("");
    } catch (error) {
      console.error('Error during booking confirmation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDialogClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };
  
  const availabilityColor = availability.toLowerCase().includes('available') 
    ? "bg-green-100 text-green-800" 
    : "bg-gray-100 text-gray-800";
  
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl text-[#333333] flex items-center">
            <span className="text-[#E02020] font-bold">Book</span>
            <span className="ml-2">{equipmentName}</span>
          </DialogTitle>
          <DialogDescription>
            Reserve this equipment for your medical procedures
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {/* Equipment Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="bg-[#E0202010] p-2 rounded-full">
                <MapPin className="h-5 w-5 text-[#E02020]" />
              </div>
              <div>
                <h4 className="font-medium text-[#333333]">Equipment Location</h4>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-gray-600">Located at <span className="font-medium">{location}</span></p>
                  <p className="text-sm text-gray-600">Part of <Badge variant="outline" className="font-normal ml-1">{cluster}</Badge> cluster</p>
                  <Badge className={`mt-2 ${availabilityColor}`}>
                    {availability}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Form */}
          <Tabs 
            defaultValue="date-time" 
            value={activeTab}
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="w-full mb-4">
              <TabsTrigger value="date-time" className="flex-1">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="details" className="flex-1">
                <Info className="mr-2 h-4 w-4" />
                Details
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="date-time" className="space-y-4 mt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="booking-date" className="text-[#333333] font-medium">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    className="rounded-md border mx-auto bg-white"
                  />
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="booking-time" className="text-[#333333] font-medium">Select Time</Label>
                  <Select 
                    value={timeSlot} 
                    onValueChange={setTimeSlot}
                  >
                    <SelectTrigger className="w-full border-gray-300 bg-white">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-[#E02020]" />
                        <SelectValue placeholder="Select time" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="13:00">01:00 PM</SelectItem>
                      <SelectItem value="14:00">02:00 PM</SelectItem>
                      <SelectItem value="15:00">03:00 PM</SelectItem>
                      <SelectItem value="16:00">04:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-[#333333] font-medium">Duration</Label>
                  <Select 
                    value={duration.toString()} 
                    onValueChange={(value) => setDuration(parseInt(value))}
                  >
                    <SelectTrigger className="w-full border-gray-300 bg-white">
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
                
                <Button 
                  type="button" 
                  className="w-full mt-4 bg-[#E02020] hover:bg-[#c01010]"
                  onClick={() => setActiveTab("details")}
                >
                  Continue to Details
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4 mt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-[#333333] font-medium">Special Requirements or Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any special requirements or additional information"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px] border-gray-300 bg-white"
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-6">
                  <h3 className="font-medium text-[#333333] mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Equipment:</span>
                      <span className="font-medium">{equipmentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{date?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">
                        {timeSlot.split(':')[0] > '12' 
                          ? `${parseInt(timeSlot.split(':')[0]) - 12}:${timeSlot.split(':')[1]} PM`
                          : `${timeSlot} AM`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per hour:</span>
                      <span className="font-medium">${pricePerUse.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#E02020]">
                      <span>Total price:</span>
                      <span>${(pricePerUse * duration).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setActiveTab("date-time")}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 bg-[#E02020] hover:bg-[#c01010]"
                    onClick={handleConfirm}
                    disabled={!date || isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
