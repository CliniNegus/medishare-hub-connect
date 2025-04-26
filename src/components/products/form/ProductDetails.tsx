
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormValues } from "@/types/product";

interface ProductDetailsProps {
  form: UseFormReturn<ProductFormValues>;
}

export const ProductDetails = ({ form }: ProductDetailsProps) => {
  return (
    <>
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
    </>
  );
};
