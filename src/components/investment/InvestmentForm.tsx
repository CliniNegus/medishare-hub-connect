
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  hospital_id: z.string().uuid({ message: 'Please select a hospital' }),
  equipment_id: z.string().uuid({ message: 'Please select equipment' }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  term: z.string().min(1, { message: 'Please specify the term' }),
  roi: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'ROI must be a non-negative number',
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InvestmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface Hospital {
  id: string;
  name: string;
}

interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
}

const InvestmentForm = ({ onSuccess, onCancel }: InvestmentFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospital_id: '',
      equipment_id: '',
      amount: '',
      term: '',
      roi: '',
      notes: '',
    },
  });

  // Fetch hospitals when component mounts
  React.useEffect(() => {
    const fetchHospitals = async () => {
      const { data, error } = await supabase.from('hospitals').select('id, name');
      
      if (error) {
        console.error('Error fetching hospitals:', error);
        toast({
          title: 'Error',
          description: 'Could not load hospitals. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      setHospitals(data || []);
    };
    
    fetchHospitals();
  }, [toast]);

  // Fetch equipment when hospital is selected
  React.useEffect(() => {
    if (!selectedHospital) return;
    
    const fetchEquipment = async () => {
      // For now, fetch all equipment. In a real app, you might want to filter by hospital
      const { data, error } = await supabase
        .from('equipment')
        .select('id, name, manufacturer');
      
      if (error) {
        console.error('Error fetching equipment:', error);
        toast({
          title: 'Error',
          description: 'Could not load equipment. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      setEquipment(data || []);
    };
    
    fetchEquipment();
  }, [selectedHospital, toast]);

  // Handle hospital selection
  const handleHospitalChange = (value: string) => {
    setSelectedHospital(value);
    form.setValue('hospital_id', value);
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to create an investment.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('investments').insert({
        investor_id: user.id,
        hospital_id: data.hospital_id,
        equipment_id: data.equipment_id,
        amount: Number(data.amount),
        term: data.term,
        roi: Number(data.roi),
        notes: data.notes,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Investment Created',
        description: 'Your investment has been successfully created.',
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Error creating investment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create investment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="hospital_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hospital</FormLabel>
              <Select 
                onValueChange={(value) => handleHospitalChange(value)} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hospital" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {hospitals.map((hospital) => (
                    <SelectItem key={hospital.id} value={hospital.id}>
                      {hospital.name}
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
          name="equipment_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedHospital}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedHospital ? "Select equipment" : "Select a hospital first"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {equipment.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.manufacturer})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Investment Amount ($)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter amount"
                    {...field}
                    type="number"
                    min="1"
                    step="1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected ROI (%)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Expected return percentage"
                    {...field}
                    type="number"
                    min="0"
                    step="0.1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="term"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Investment Term</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="12 months">12 months</SelectItem>
                  <SelectItem value="24 months">24 months</SelectItem>
                  <SelectItem value="36 months">36 months</SelectItem>
                  <SelectItem value="48 months">48 months</SelectItem>
                  <SelectItem value="60 months">60 months</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes about this investment"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-[#E02020] hover:bg-[#C01010] text-white"
          >
            {isSubmitting ? "Creating..." : "Create Investment"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvestmentForm;
