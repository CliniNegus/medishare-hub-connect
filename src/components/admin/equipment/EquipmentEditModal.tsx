
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Equipment } from '@/hooks/useEquipmentManagement';

const editEquipmentSchema = z.object({
  name: z.string().min(1, { message: "Equipment name is required" }),
  manufacturer: z.string().optional(),
  status: z.string().min(1, { message: "Status is required" }),
  location: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  lease_rate: z.string().optional(),
});

type EditEquipmentFormValues = z.infer<typeof editEquipmentSchema>;

interface EquipmentEditModalProps {
  equipment: Equipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<Equipment>) => Promise<void>;
}

const EquipmentEditModal: React.FC<EquipmentEditModalProps> = ({
  equipment,
  open,
  onOpenChange,
  onSave
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<EditEquipmentFormValues>({
    resolver: zodResolver(editEquipmentSchema),
    defaultValues: {
      name: "",
      manufacturer: "",
      status: "",
      location: "",
      category: "",
      description: "",
      price: "",
      lease_rate: "",
    }
  });

  // Update form when equipment changes
  React.useEffect(() => {
    if (equipment) {
      form.reset({
        name: equipment.name || "",
        manufacturer: equipment.manufacturer || "",
        status: equipment.status || "",
        location: equipment.location || "",
        category: equipment.category || "",
        description: equipment.description || "",
        price: equipment.price?.toString() || "",
        lease_rate: equipment.lease_rate?.toString() || "",
      });
    }
  }, [equipment, form]);

  const handleSubmit = async (values: EditEquipmentFormValues) => {
    if (!equipment) return;
    
    try {
      setIsSubmitting(true);
      
      // Convert string values to appropriate types
      const updates: Partial<Equipment> = {
        name: values.name,
        manufacturer: values.manufacturer || null,
        status: values.status,
        location: values.location || null,
        category: values.category || null,
        description: values.description || null,
        price: values.price ? parseFloat(values.price) : null,
        lease_rate: values.lease_rate ? parseFloat(values.lease_rate) : null,
      };

      await onSave(equipment.id, updates);
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!equipment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#333333]">Edit Equipment</DialogTitle>
          <DialogDescription>
            Update equipment information and settings.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter equipment name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter manufacturer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="In-Use">In-Use</SelectItem>
                        <SelectItem value="Leased">Leased</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Out of Service">Out of Service</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="Enter price" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="lease_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lease Rate ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="Enter lease rate" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter equipment description" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#E02020] hover:bg-[#E02020]/90" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentEditModal;
