
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  lease_rate: z.coerce.number().positive("Lease rate must be a positive number").optional(),
  condition: z.string().min(2, "Condition must be at least 2 characters"),
  specs: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export type Product = ProductFormValues & {
  id: string;
  owner_id: string;
  status: string;
  created_at: string;
  updated_at: string;
};
