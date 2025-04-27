
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Define form schema
const productFormSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  manufacturer: z.string().optional(),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  lease_rate: z.number().min(0, { message: "Lease rate must be a positive number" }).optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  image_url: z.string().optional(),
  inventory: z.number().int().min(0, { message: "Inventory must be a positive number" }).default(0),
  iot_id: z.string().optional(),
  condition: z.string().default("New"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
  onProductAdded?: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ 
  open, 
  onOpenChange, 
  isAdmin = false,
  onProductAdded
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      category: "",
      manufacturer: isAdmin ? "" : user?.email?.split('@')[0] || "",
      price: 0,
      lease_rate: 0,
      description: "",
      image_url: "",
      inventory: 1,
      iot_id: "",
      condition: "New"
    }
  });

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      
      const productData = {
        name: values.name,
        category: values.category,
        price: values.price,
        lease_rate: values.lease_rate || Math.round(values.price * 0.05),
        description: values.description,
        owner_id: user?.id,
        status: 'Available',
        condition: values.condition,
        available_inventory: values.inventory,
        iot_device_id: values.iot_id || null
      };

      const { error } = await supabase
        .from('equipment')
        .insert(productData);
        
      if (error) throw error;
      
      toast({
        title: "Product Added Successfully",
        description: `${values.name} has been added to your inventory`,
      });
      
      form.reset();
      onOpenChange(false);
      if (onProductAdded) {
        onProductAdded();
      }
      
    } catch (error: any) {
      console.error('Error adding product:', error.message);
      toast({
        title: "Failed to add product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-[#333333]">Add New Product</DialogTitle>
          <DialogDescription>
            Enter the details of the new medical equipment item.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Imaging Equipment">Imaging Equipment</SelectItem>
                        <SelectItem value="Patient Monitoring">Patient Monitoring</SelectItem>
                        <SelectItem value="Surgical Equipment">Surgical Equipment</SelectItem>
                        <SelectItem value="Diagnostic Equipment">Diagnostic Equipment</SelectItem>
                        <SelectItem value="Laboratory Equipment">Laboratory Equipment</SelectItem>
                        <SelectItem value="Therapy Equipment">Therapy Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isAdmin && (
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter manufacturer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lease_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lease Rate ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
                        
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter product description" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="inventory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Inventory</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Refurbished">Refurbished</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="iot_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IoT Device ID (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter IoT device ID" {...field} />
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
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#E02020] hover:bg-[#E02020]/90" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
