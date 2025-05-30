
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface LeaseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  userRole?: string;
  userId?: string;
}

const LeaseForm = ({ onSuccess, onCancel, userRole, userId }: LeaseFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [investors, setInvestors] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  
  const form = useForm({
    defaultValues: {
      equipment_id: "",
      hospital_id: "",
      investor_id: "",
      start_date: new Date(),
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 12)), // Default to 12 months
      monthly_payment: "",
      total_value: "",
      notes: ""
    }
  });

  useEffect(() => {
    fetchHospitals();
    fetchInvestors();
    fetchEquipment();
    
    // Set user ID based on role
    if (userRole && userId) {
      if (userRole === 'hospital') {
        form.setValue('hospital_id', userId);
      } else if (userRole === 'investor') {
        form.setValue('investor_id', userId);
      }
    }
  }, [userRole, userId]);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, organization, email')
        .eq('role', 'hospital');
        
      if (error) throw error;
      setHospitals(data || []);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  const fetchInvestors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, organization, email')
        .eq('role', 'investor');
        
      if (error) throw error;
      setInvestors(data || []);
    } catch (error) {
      console.error('Error fetching investors:', error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('id, name, category')
        .eq('status', 'available');
        
      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Calculate the total lease value
      const monthsDiff = 
        (values.end_date.getFullYear() - values.start_date.getFullYear()) * 12 + 
        (values.end_date.getMonth() - values.start_date.getMonth());
      
      const totalValue = parseFloat(values.monthly_payment) * monthsDiff;
      
      const { error } = await supabase
        .from('leases')
        .insert({
          equipment_id: values.equipment_id,
          hospital_id: values.hospital_id,
          investor_id: values.investor_id || null, // Allow null for optional investor
          start_date: values.start_date.toISOString(),
          end_date: values.end_date.toISOString(),
          monthly_payment: parseFloat(values.monthly_payment),
          total_value: totalValue,
          status: 'active'
        });

      if (error) throw error;
      
      // Update equipment status
      await supabase
        .from('equipment')
        .update({ status: 'leased' })
        .eq('id', values.equipment_id);
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error creating lease",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="equipment_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {equipment.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} ({item.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hospital_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hospital</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={loading || userRole === 'hospital'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hospital" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hospitals.map((hospital) => (
                      <SelectItem key={hospital.id} value={hospital.id}>
                        {hospital.organization || hospital.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="investor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Investor (Optional)</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                  defaultValue={field.value || "none"}
                  disabled={loading || userRole === 'investor'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select investor or leave empty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No Investor</SelectItem>
                    {investors.map((investor) => (
                      <SelectItem key={investor.id} value={investor.id}>
                        {investor.organization || investor.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthly_payment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Payment ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    {...field} 
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                        disabled={loading}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                        disabled={loading}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => 
                        date < new Date() || 
                        date < form.getValues("start_date")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional details about this lease" 
                  className="resize-none" 
                  {...field} 
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-[#E02020] hover:bg-[#E02020]/90 text-white"
          >
            {loading ? "Creating..." : "Create Lease"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LeaseForm;
