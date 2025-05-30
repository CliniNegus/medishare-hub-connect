
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormValues } from "@/types/product";

interface SalesOptionsFieldProps {
  form: UseFormReturn<ProductFormValues>;
}

export const SalesOptionsField = ({ form }: SalesOptionsFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="sales_option"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sales Option</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select sales option" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="direct_sale">Direct Sale Only</SelectItem>
              <SelectItem value="lease">Lease Only</SelectItem>
              <SelectItem value="both">Both Sale & Lease</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Choose how this equipment can be acquired by hospitals
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
