
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  lease_rate: z.coerce.number().positive("Lease rate must be a positive number").optional(),
  condition: z.string().min(2, "Condition must be at least 2 characters"),
  specs: z.string().optional(),
  image_url: z.string().optional(),
  shareable: z.boolean().default(true),
  manufacturer: z.string().min(2, "Manufacturer must be at least 2 characters"),
  model: z.string().min(2, "Model must be at least 2 characters"),
  year_manufactured: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  serial_number: z.string().optional(),
  sales_option: z.enum(['direct_sale', 'lease', 'both']).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export type Product = ProductFormValues & {
  id: string | number;
  owner_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  sales_option?: 'direct_sale' | 'lease' | 'both' | null; // Updated to allow null
  description?: string;
};
