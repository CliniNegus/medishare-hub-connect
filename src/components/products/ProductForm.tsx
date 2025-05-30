
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicProductInfo } from './form/BasicProductInfo';
import { ManufacturerInfo } from './form/ManufacturerInfo';
import { ProductDetails } from './form/ProductDetails';
import { PricingSection } from './form/PricingSection';
import { ShareableSwitch } from './form/ShareableSwitch';
import { SalesOptionsField } from './form/SalesOptionsField';
import ImageUpload from './ImageUpload';
import { ProductFormValues, productSchema } from "@/types/product";
import { WebsiteProductImport } from './WebsiteProductImport';
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  onSubmit: (values: ProductFormValues) => Promise<void>;
  initialValues?: Partial<ProductFormValues>;
  isLoading: boolean;
  isEditing: boolean;
  onCancel?: () => void;
}

export const ProductForm = ({ onSubmit, initialValues, isLoading, isEditing, onCancel }: ProductFormProps) => {
  const { toast } = useToast();
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
      sales_option: 'both',
      ...initialValues
    },
  });

  const calculateLeaseRate = () => {
    const price = form.getValues("price");
    if (!price) return;
    const suggestedLeaseRate = Math.round(price * 0.05);
    form.setValue("lease_rate", suggestedLeaseRate);
  };

  const handleWebsiteImport = (productData: any) => {
    form.reset(productData);
  };

  const handleFormSubmit = async (values: ProductFormValues) => {
    try {
      await onSubmit(values);
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit form",
        variant: "destructive",
      });
    }
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
        {!isEditing && (
          <WebsiteProductImport onProductExtracted={handleWebsiteImport} />
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <ImageUpload
                    onImageUploaded={field.onChange}
                    currentImageUrl={field.value}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <BasicProductInfo form={form} />
            <ManufacturerInfo form={form} />
            <PricingSection form={form} onCalculateLeaseRate={calculateLeaseRate} />
            <SalesOptionsField form={form} />
            <ShareableSwitch form={form} />
            <ProductDetails form={form} />
            
            <div className="flex justify-end space-x-2">
              {onCancel && (
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
