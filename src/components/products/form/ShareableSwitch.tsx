
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormValues } from "@/types/product";

interface ShareableSwitchProps {
  form: UseFormReturn<ProductFormValues>;
}

export const ShareableSwitch = ({ form }: ShareableSwitchProps) => {
  return (
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
  );
};
