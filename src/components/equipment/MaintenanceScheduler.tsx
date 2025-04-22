
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, CalendarCheck, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MaintenanceTask {
  id: string;
  equipmentId: string;
  equipmentName: string;
  date: Date;
  type: 'preventive' | 'corrective' | 'calibration';
  notes: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  completed: boolean;
  createdAt: Date;
}

interface MaintenanceSchedulerProps {
  equipmentId: string;
  equipmentName: string;
  onSchedule?: (task: MaintenanceTask) => void;
  onClose?: () => void;
}

const MaintenanceScheduler: React.FC<MaintenanceSchedulerProps> = ({
  equipmentId,
  equipmentName,
  onSchedule,
  onClose
}) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [maintenanceType, setMaintenanceType] = useState<'preventive' | 'corrective' | 'calibration'>('preventive');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [assignee, setAssignee] = useState('');
  const [remindBefore, setRemindBefore] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        variant: "destructive",
        title: "Date Required",
        description: "Please select a maintenance date.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a new maintenance task
      const newTask: MaintenanceTask = {
        id: `maint-${Date.now()}`,
        equipmentId,
        equipmentName,
        date,
        type: maintenanceType,
        notes,
        priority,
        assignee,
        completed: false,
        createdAt: new Date()
      };
      
      // In a real app, this would save to the database
      // For demo, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSchedule) {
        onSchedule(newTask);
      }
      
      toast({
        title: "Maintenance Scheduled",
        description: `Maintenance scheduled for ${date.toLocaleDateString()}`,
      });
      
      // Simulate notifications if enabled
      if (remindBefore) {
        toast({
          title: "Reminder Set",
          description: `You'll be reminded before the scheduled maintenance`,
        });
      }
      
      // Reset form
      setDate(new Date());
      setMaintenanceType('preventive');
      setNotes('');
      setPriority('medium');
      setAssignee('');
      
      if (onClose) {
        onClose();
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to schedule maintenance",
        description: error.message || "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="w-full border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <CalendarCheck className="h-5 w-5 mr-2" />
          Schedule Maintenance
        </CardTitle>
        <CardDescription>
          Schedule maintenance for {equipmentName} (ID: {equipmentId})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maintenance-date">Maintenance Date</Label>
              <Calendar 
                mode="single" 
                selected={date} 
                onSelect={setDate} 
                className="border rounded-md p-2"
                disabled={(date) => date < new Date()}
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maintenance-type">Maintenance Type</Label>
                <Select value={maintenanceType} onValueChange={(value: any) => setMaintenanceType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select maintenance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventive">Preventive Maintenance</SelectItem>
                    <SelectItem value="corrective">Corrective Maintenance</SelectItem>
                    <SelectItem value="calibration">Calibration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="text-green-600">Low</SelectItem>
                    <SelectItem value="medium" className="text-amber-600">Medium</SelectItem>
                    <SelectItem value="high" className="text-red-600">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Input 
                  id="assignee" 
                  placeholder="Who will perform the maintenance" 
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox 
                  id="reminder" 
                  checked={remindBefore} 
                  onCheckedChange={() => setRemindBefore(!remindBefore)} 
                />
                <Label htmlFor="reminder" className="flex items-center text-sm">
                  <Bell className="h-3 w-3 mr-1" />
                  Remind before maintenance
                </Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea 
              id="notes" 
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Additional maintenance details"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={isSubmitting || !date}
        >
          {isSubmitting ? "Scheduling..." : "Schedule Maintenance"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MaintenanceScheduler;
