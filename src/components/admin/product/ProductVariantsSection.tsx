
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";

interface ProductVariant {
  dimension_name: string;
  dimension_value: string;
  price: number;
  stock_quantity: number;
}

interface ProductVariantsSectionProps {
  form: UseFormReturn<any>;
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
}

const predefinedDimensions = [
  "Size",
  "Weight", 
  "Volume",
  "Length",
  "Width",
  "Height",
  "Capacity",
  "Custom"
];

export const ProductVariantsSection = ({ form, variants, onVariantsChange }: ProductVariantsSectionProps) => {
  const addVariant = () => {
    const newVariant: ProductVariant = {
      dimension_name: "",
      dimension_value: "",
      price: 0,
      stock_quantity: 0
    };
    onVariantsChange([...variants, newVariant]);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    onVariantsChange(newVariants);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    onVariantsChange(newVariants);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#333333]">Product Variants</h3>
        <Button
          type="button"
          onClick={addVariant}
          variant="outline"
          size="sm"
          className="border-[#E02020] text-[#E02020] hover:bg-[#E02020]/5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <p>No variants added yet. Click "Add Variant" to create dimension-price combinations.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-[#333333]">Variant {index + 1}</h4>
                <Button
                  type="button"
                  onClick={() => removeVariant(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel className="text-[#333333]">Dimension Type</FormLabel>
                  <Select
                    value={variant.dimension_name}
                    onValueChange={(value) => updateVariant(index, 'dimension_name', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select dimension type" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedDimensions.map((dimension) => (
                        <SelectItem key={dimension} value={dimension}>
                          {dimension}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <FormLabel className="text-[#333333]">Dimension Value</FormLabel>
                  <Input
                    placeholder="e.g., Small, 30x30cm, 500ml"
                    value={variant.dimension_value}
                    onChange={(e) => updateVariant(index, 'dimension_value', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel className="text-[#333333]">Price (₦)</FormLabel>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                  />
                </div>

                <div>
                  <FormLabel className="text-[#333333]">Stock Quantity</FormLabel>
                  <Input
                    type="number"
                    placeholder="0"
                    value={variant.stock_quantity}
                    onChange={(e) => updateVariant(index, 'stock_quantity', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
