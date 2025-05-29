
import React, { useState } from 'react';
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

interface ScheduleMaintenanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAlert?: any;
  onScheduled: () => void;
}

const ScheduleMaintenanceModal: React.FC<ScheduleMaintenanceModalProps> = ({
  open,
  onOpenChange,
  selectedAlert,
  onScheduled
}) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [maintenanceType, setMaintenanceType] = useState('');
  const [notes, setNotes] = useState('');
  const [technician, setTechnician] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !maintenanceType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create maintenance record
      const { error: maintenanceError } = await supabase
        .from('maintenance')
        .insert({
          equipment_id: selectedAlert?.equipment_id,
          scheduled_date: date.toISOString(),
          status: 'scheduled',
          description: `${maintenanceType}: ${notes}`,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (maintenanceError) throw maintenanceError;

      // Update alert status
      if (selectedAlert) {
        const { error: alertError } = await supabase
          .from('maintenance_alerts')
          .update({
            status: 'scheduled',
            scheduled_maintenance_date: date.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedAlert.id);

        if (alertError) throw alertError;
      }

      toast({
        title: "Success",
        description: "Maintenance scheduled successfully",
      });

      onScheduled();
      // Reset form
      setDate(undefined);
      setMaintenanceType('');
      setNotes('');
      setTechnician('');
    } catch (error: any) {
      console.error('Error scheduling maintenance:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to schedule maintenance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#333333]">
            Schedule Maintenance
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedAlert && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium">{selectedAlert.equipment_name}</p>
              <p className="text-sm text-gray-600">{selectedAlert.location}</p>
              <p className="text-sm text-gray-600">{selectedAlert.issue_description}</p>
            </div>
          )}

          <div>
            <Label htmlFor="maintenance-type">Maintenance Type*</Label>
            <Select value={maintenanceType} onValueChange={setMaintenanceType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select maintenance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Preventive Maintenance">Preventive Maintenance</SelectItem>
                <SelectItem value="Corrective Maintenance">Corrective Maintenance</SelectItem>
                <SelectItem value="Calibration">Calibration</SelectItem>
                <SelectItem value="Inspection">Inspection</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
              </SelectContent>
            </Select>
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
            <Label htmlFor="technician">Assigned Technician</Label>
            <Input
              id="technician"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              placeholder="Enter technician name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="notes">Maintenance Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter maintenance details and instructions"
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
              {loading ? "Scheduling..." : "Schedule Maintenance"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMaintenanceModal;
