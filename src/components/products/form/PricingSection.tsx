
import React from 'react';
import { Calculator } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormValues } from "@/types/product";

interface PricingSectionProps {
  form: UseFormReturn<ProductFormValues>;
  onCalculateLeaseRate: () => void;
}

export const PricingSection = ({ form, onCalculateLeaseRate }: PricingSectionProps) => {
  return (
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
                onClick={onCalculateLeaseRate}
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
  );
};
