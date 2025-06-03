
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  stock_quantity: number;
  manufacturer?: string;
  image_url?: string;
  is_featured?: boolean;
  is_disposable?: boolean;
  rating?: number;
  sku?: string;
  tags?: string[];
  weight?: number;
  dimensions?: any;
  has_variants?: boolean;
  base_price?: number;
  created_at: string;
  updated_at: string;
}

interface ProductVariant {
  dimension_name: string;
  dimension_value: string;
  price: number;
  stock_quantity: number;
}

interface ProductFormValues {
  name: string;
  description?: string;
  category?: string;
  price: number;
  stock_quantity: number;
  manufacturer?: string;
  image_url?: string;
  is_featured?: boolean;
  is_disposable?: boolean;
  sku?: string;
  tags?: string[];
  weight?: number;
  dimensions?: any;
  has_variants?: boolean;
  variants?: ProductVariant[];
}

export const useAdminProductManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
      toast({
        title: "Failed to load products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      setLoading(true);
      
      const productData = {
        name: values.name,
        description: values.description,
        category: values.category,
        price: values.has_variants ? (values.variants?.[0]?.price || 0) : values.price,
        base_price: values.has_variants ? (values.variants?.[0]?.price || 0) : values.price,
        stock_quantity: values.has_variants ? (values.variants?.reduce((total, variant) => total + variant.stock_quantity, 0) || 0) : values.stock_quantity,
        manufacturer: values.manufacturer,
        image_url: values.image_url,
        is_featured: values.is_featured || false,
        is_disposable: values.is_disposable !== undefined ? values.is_disposable : true,
        sku: values.sku,
        tags: values.tags,
        weight: values.weight,
        dimensions: values.dimensions,
        has_variants: values.has_variants || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: productResult, error: productError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
        
      if (productError) throw productError;

      // If product has variants, insert them
      if (values.has_variants && values.variants && values.variants.length > 0) {
        const variantData = values.variants.map(variant => ({
          product_id: productResult.id,
          dimension_name: variant.dimension_name,
          dimension_value: variant.dimension_value,
          price: variant.price,
          stock_quantity: variant.stock_quantity,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        const { error: variantError } = await supabase
          .from('product_variants')
          .insert(variantData);

        if (variantError) throw variantError;
      }
      
      toast({
        title: "Product added",
        description: `${values.name} has been added to the shop${values.has_variants ? ' with variants' : ''}`,
      });
      
      await fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error.message);
      toast({
        title: "Failed to save product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (productId: string, values: ProductFormValues) => {
    try {
      setLoading(true);
      
      const productData = {
        name: values.name,
        description: values.description,
        category: values.category,
        price: values.has_variants ? (values.variants?.[0]?.price || 0) : values.price,
        base_price: values.has_variants ? (values.variants?.[0]?.price || 0) : values.price,
        stock_quantity: values.has_variants ? (values.variants?.reduce((total, variant) => total + variant.stock_quantity, 0) || 0) : values.stock_quantity,
        manufacturer: values.manufacturer,
        image_url: values.image_url,
        is_featured: values.is_featured || false,
        is_disposable: values.is_disposable !== undefined ? values.is_disposable : true,
        sku: values.sku,
        tags: values.tags,
        weight: values.weight,
        dimensions: values.dimensions,
        has_variants: values.has_variants || false,
        updated_at: new Date().toISOString(),
      };

      const { error: productError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId);
        
      if (productError) throw productError;

      // Delete existing variants
      await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', productId);

      // If product has variants, insert new ones
      if (values.has_variants && values.variants && values.variants.length > 0) {
        const variantData = values.variants.map(variant => ({
          product_id: productId,
          dimension_name: variant.dimension_name,
          dimension_value: variant.dimension_value,
          price: variant.price,
          stock_quantity: variant.stock_quantity,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        const { error: variantError } = await supabase
          .from('product_variants')
          .insert(variantData);

        if (variantError) throw variantError;
      }
      
      toast({
        title: "Product updated",
        description: `${values.name} has been updated successfully`,
      });
      
      await fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error.message);
      toast({
        title: "Failed to update product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      setLoading(true);
      
      // Delete product variants first (cascade should handle this, but being explicit)
      await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', productId);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
      
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      });
      
      await fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error.message);
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    handleSubmit,
    handleUpdate,
    handleDelete,
    fetchProducts,
  };
};
