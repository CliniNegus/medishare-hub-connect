
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Maintenance {
  id: string;
  equipment_id?: string;
  scheduled_date: string;
  status: string;
  description: string;
  equipment?: {
    name: string;
    location?: string;
  };
}

interface EditMaintenanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance: Maintenance | null;
  onUpdated: () => void;
}

const EditMaintenanceModal: React.FC<EditMaintenanceModalProps> = ({
  open,
  onOpenChange,
  maintenance,
  onUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (maintenance) {
      setDate(new Date(maintenance.scheduled_date));
      setStatus(maintenance.status);
      setDescription(maintenance.description);
    }
  }, [maintenance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !status || !description || !maintenance) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('maintenance')
        .update({
          scheduled_date: date.toISOString(),
          status,
          description,
          updated_at: new Date().toISOString(),
          ...(status === 'completed' && { completed_date: new Date().toISOString() })
        })
        .eq('id', maintenance.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Maintenance updated successfully",
      });

      onUpdated();
    } catch (error: any) {
      console.error('Error updating maintenance:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update maintenance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!maintenance) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#333333]">
            Edit Maintenance
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="font-medium">{maintenance.equipment?.name || 'Unknown Equipment'}</p>
            <p className="text-sm text-gray-600">{maintenance.equipment?.location || 'Location not specified'}</p>
          </div>

          <div>
            <Label>Scheduled Date*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="status">Status*</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter maintenance description"
              className="mt-1 h-20"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#E02020] hover:bg-[#c01010] text-white"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Maintenance"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMaintenanceModal;
