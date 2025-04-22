
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, FileText, Calendar as CalendarIcon, Settings } from "lucide-react";
import { EquipmentProps } from '../EquipmentCard';
import { format, addDays } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface MaintenanceSchedulerProps {
  equipmentData: EquipmentProps[];
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string) => void;
}

const MaintenanceScheduler: React.FC<MaintenanceSchedulerProps> = ({
  equipmentData,
  selectedEquipmentId,
  onSelectEquipment
}) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [maintenanceType, setMaintenanceType] = useState("calibration");
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState("2");
  const [scheduled, setScheduled] = useState<{
    equipmentId: string;
    name: string;
    date: Date;
    type: string;
    notes: string;
    duration: string;
  }[]>([
    {
      equipmentId: "eq-001",
      name: "MRI Scanner Pro",
      date: addDays(new Date(), 5),
      type: "preventive",
      notes: "Regular 6-month maintenance",
      duration: "4"
    },
    {
      equipmentId: "eq-002",
      name: "CT Scanner X5",
      date: addDays(new Date(), 2),
      type: "calibration",
      notes: "Calibrate after installation",
      duration: "2"
    }
  ]);

  const handleSchedule = () => {
    if (!selectedEquipmentId || !date) {
      toast({
        title: "Cannot Schedule Maintenance",
        description: "Please select an equipment and date",
        variant: "destructive"
      });
      return;
    }

    const equipment = equipmentData.find(eq => eq.id === selectedEquipmentId);
    if (!equipment) return;

    const newSchedule = {
      equipmentId: selectedEquipmentId,
      name: equipment.name,
      date: date,
      type: maintenanceType,
      notes: notes,
      duration: duration
    };

    setScheduled([...scheduled, newSchedule]);
    
    toast({
      title: "Maintenance Scheduled",
      description: `${equipment.name} maintenance scheduled for ${format(date, 'PPP')}`,
    });

    // Reset form
    setNotes("");
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "preventive": return "Preventive";
      case "corrective": return "Corrective";
      case "calibration": return "Calibration";
      case "inspection": return "Inspection";
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "preventive": return "bg-green-100 text-green-800";
      case "corrective": return "bg-red-100 text-red-800";
      case "calibration": return "bg-blue-100 text-blue-800";
      case "inspection": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-red-800">Schedule Maintenance</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="equipment">Select Equipment</Label>
                <Select 
                  value={selectedEquipmentId || ""} 
                  onValueChange={onSelectEquipment}
                >
                  <SelectTrigger id="equipment">
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentData.map(equipment => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Maintenance Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md"
                  disabled={(date) => date < new Date()}
                />
              </div>
              
              <div>
                <Label htmlFor="type">Maintenance Type</Label>
                <Select value={maintenanceType} onValueChange={setMaintenanceType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventive">Preventive Maintenance</SelectItem>
                    <SelectItem value="corrective">Corrective Maintenance</SelectItem>
                    <SelectItem value="calibration">Calibration</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (hours)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes">Maintenance Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Enter maintenance details and instructions" 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-24"
                />
              </div>
              
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={handleSchedule}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Schedule Maintenance
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-red-800">Upcoming Maintenance</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduled.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No maintenance scheduled
                    </TableCell>
                  </TableRow>
                ) : (
                  scheduled.sort((a, b) => a.date.getTime() - b.date.getTime()).map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                          {format(item.date, 'PPP')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(item.type)}`}>
                          {getTypeLabel(item.type)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          {item.duration} hours
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-600 hover:bg-red-50">
                            <FileText className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-600 hover:bg-red-50">
                            <Settings className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceScheduler;
