import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ImageUpload from './ImageUpload';
import { ProductFormValues, productSchema } from "@/types/product";

interface ProductFormProps {
  onSubmit: (values: ProductFormValues) => Promise<void>;
  initialValues?: Partial<ProductFormValues>;
  isLoading: boolean;
  isEditing: boolean;
  onCancel?: () => void;
}

export const ProductForm = ({ onSubmit, initialValues, isLoading, isEditing, onCancel }: ProductFormProps) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      price: 0,
      lease_rate: undefined,
      condition: 'New',
      specs: '',
      image_url: '',
      shareable: true,
      manufacturer: '',
      model: '',
      year_manufactured: undefined,
      serial_number: '',
      ...initialValues
    },
  });

  const calculateLeaseRate = () => {
    const price = form.getValues("price");
    if (!price) return;
    const suggestedLeaseRate = Math.round(price * 0.05);
    form.setValue("lease_rate", suggestedLeaseRate);
  };

  return (
    <Card className="border-red-600">
      <CardHeader>
        <CardTitle className="text-red-600">{isEditing ? "Edit Product" : "Add New Product"}</CardTitle>
        <CardDescription>
          {isEditing 
            ? "Update the details of your existing medical equipment"
            : "Add new medical equipment to your inventory"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onImageUploaded={field.onChange}
                      currentImageUrl={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. MRI Scanner X5" {...field} />
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
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Diagnostic">Diagnostic Equipment</SelectItem>
                        <SelectItem value="Monitoring">Monitoring Devices</SelectItem>
                        <SelectItem value="Surgical">Surgical Equipment</SelectItem>
                        <SelectItem value="Laboratory">Laboratory Equipment</SelectItem>
                        <SelectItem value="Imaging">Imaging Systems</SelectItem>
                        <SelectItem value="Emergency">Emergency Equipment</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Input placeholder="e.g. Siemens, GE Healthcare" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Acuson X300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year_manufactured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Manufactured</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 2023"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serial_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Equipment serial number" {...field} />
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
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Refurbished">Refurbished</SelectItem>
                        <SelectItem value="Used - Like New">Used - Like New</SelectItem>
                        <SelectItem value="Used - Good">Used - Good</SelectItem>
                        <SelectItem value="Used - Fair">Used - Fair</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Purchase Price ($)</FormLabel>
                      <div className="flex items-center">
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={calculateLeaseRate}
                          className="ml-2"
                          title="Calculate suggested lease rate"
                        >
                          <Calculator className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lease_rate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Monthly Lease Rate ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Calculate or enter manually"
                          value={field.value || ''}
                          onChange={field.onChange}
                          className="pl-8"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Suggested: ~5% of purchase price
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="shareable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Shareable Equipment</FormLabel>
                    <FormDescription>
                      Make this equipment visible to other hospitals in the network
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                      placeholder="Provide a detailed description of the equipment"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="specs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Specifications</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter detailed technical specifications (dimensions, power requirements, etc.)"
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Include detailed technical information that hospitals would need to know
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              {isEditing && onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
