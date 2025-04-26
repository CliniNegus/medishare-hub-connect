
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicProductInfo } from './form/BasicProductInfo';
import { ManufacturerInfo } from './form/ManufacturerInfo';
import { ProductDetails } from './form/ProductDetails';
import { PricingSection } from './form/PricingSection';
import { ShareableSwitch } from './form/ShareableSwitch';
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
                <ImageUpload
                  onImageUploaded={field.onChange}
                  currentImageUrl={field.value}
                />
              )}
            />

            <BasicProductInfo form={form} />
            <ManufacturerInfo form={form} />
            <PricingSection form={form} onCalculateLeaseRate={calculateLeaseRate} />
            <ShareableSwitch form={form} />
            <ProductDetails form={form} />
            
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
